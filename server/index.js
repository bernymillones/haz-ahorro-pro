// server/index.js
import express from "express";
import crypto from "crypto";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(bodyParser.json());

// === CONFIGURACIÓN ===
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY;
const CRYPTOMUS_MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID;
const CRYPTOMUS_WEBHOOK_SECRET = process.env.CRYPTOMUS_WEBHOOK_SECRET;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// === UTILIDADES CRYPTOMUS ===
function generateCryptomusSignature(data, apiKey) {
  const jsonString = JSON.stringify(data);
  const base64Data = Buffer.from(jsonString).toString("base64");
  return crypto.createHash("md5").update(base64Data + apiKey).digest("hex");
}

// === ENDPOINT: CREAR PAGO ===
app.post("/create-payment", async (req, res) => {
  try {
    const { amount, currency = "USD", order_id } = req.body;

    if (!amount || !order_id) {
      return res.status(400).json({ error: "amount y order_id son requeridos" });
    }

    const paymentData = {
      amount: amount.toString(),
      currency,
      order_id,
      url_callback: `${API_BASE_URL}/webhook/cryptomus`,
      url_return: `${API_BASE_URL}/dashboard`,
      is_payment_multiple: false,
      lifetime: 3600,
    };

    const signature = generateCryptomusSignature(paymentData, CRYPTOMUS_API_KEY);

    const response = await fetch("https://api.cryptomus.com/v1/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: CRYPTOMUS_MERCHANT_ID,
        sign: signature,
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (result.state === 0 && result.result) {
      console.log("✅ Pago creado en Cryptomus:", result.result.url);
      return res.json({
        success: true,
        payment_url: result.result.url,
        payment_id: result.result.uuid,
      });
    } else {
      console.error("❌ Error de Cryptomus:", result);
      return res.status(500).json({ error: "Error al crear pago en Cryptomus", details: result });
    }
  } catch (err) {
    console.error("❌ Error en /create-payment:", err);
    return res.status(500).json({ error: err.message });
  }
});

// === ENDPOINT: CREAR SUSCRIPCIÓN ===
app.post("/create-subscription", async (req, res) => {
  try {
    const { user_email, user_name, plan_type, amount, months_duration = 12, monthly_yield } = req.body;

    if (!user_email || !plan_type || !amount || !monthly_yield) {
      return res.status(400).json({ 
        error: "user_email, plan_type, amount y monthly_yield son requeridos" 
      });
    }

    // 1. Crear o verificar usuario
    let userId;
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", user_email)
      .single();

    if (existingUser) {
      userId = existingUser.id;
      console.log("✅ Usuario existente encontrado:", userId);
    } else {
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert([{ email: user_email, name: user_name || user_email.split("@")[0] }])
        .select()
        .single();

      if (userError) {
        console.error("❌ Error al crear usuario:", userError);
        return res.status(500).json({ error: "Error al crear usuario", details: userError });
      }

      userId = newUser.id;
      console.log("✅ Nuevo usuario creado:", userId);
    }

    // 2. Crear plan de ahorro
    const { data: plan, error: planError } = await supabase
      .from("savings_plans")
      .insert([{
        user_id: userId,
        plan_type,
        amount,
        monthly_yield,
        months_duration,
        status: "pendiente",
        start_date: new Date().toISOString().split("T")[0],
      }])
      .select()
      .single();

    if (planError) {
      console.error("❌ Error al crear plan:", planError);
      return res.status(500).json({ error: "Error al crear plan", details: planError });
    }

    console.log("✅ Plan creado:", plan.id);

    // 3. Crear transacción inicial
    const orderId = `hd-${plan.id}-${Date.now()}`;
    const { data: transaction, error: txError } = await supabase
      .from("transactions")
      .insert([{
        plan_id: plan.id,
        payment_type: "aporte_inicial",
        amount,
        status: "pendiente",
        tx_hash: orderId,
      }])
      .select()
      .single();

    if (txError) {
      console.error("❌ Error al crear transacción:", txError);
      return res.status(500).json({ error: "Error al crear transacción", details: txError });
    }

    console.log("✅ Transacción creada:", transaction.id);

    return res.json({
      success: true,
      user_id: userId,
      plan_id: plan.id,
      transaction_id: transaction.id,
      order_id: orderId,
    });
  } catch (err) {
    console.error("❌ Error en /create-subscription:", err);
    return res.status(500).json({ error: err.message });
  }
});

// === ENDPOINT WEBHOOK ===
app.post("/webhook/cryptomus", async (req, res) => {
  try {
    const signature = req.headers["sign"];
    const rawBody = JSON.stringify(req.body);
    const expectedSign = crypto
      .createHash("md5")
      .update(rawBody + CRYPTOMUS_WEBHOOK_SECRET)
      .digest("hex");

    // Verificación de firma
    if (signature !== expectedSign) {
      console.log("❌ Firma inválida del webhook.");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payment = req.body;
    console.log("✅ Webhook recibido:", payment);

    // Solo procesamos pagos confirmados
    if (payment.status === "paid" || payment.status === "confirm_check") {
      const orderId = payment.order_id || payment.merchant_order_id;
      const amount = parseFloat(payment.amount);
      const currency = payment.currency || "USD";
      const walletAddress = payment.payer_address || null;

      // Buscar transacción existente por order_id
      const { data: existingTx } = await supabase
        .from("transactions")
        .select("*, savings_plans(user_id)")
        .eq("tx_hash", orderId)
        .single();

      if (existingTx) {
        // Actualizar transacción existente
        const { error: updateError } = await supabase
          .from("transactions")
          .update({ 
            status: "confirmado",
            payment_date: new Date().toISOString()
          })
          .eq("id", existingTx.id);

        if (updateError) {
          console.error("❌ Error al actualizar transacción:", updateError);
        } else {
          console.log("✅ Transacción actualizada a confirmada:", existingTx.id);
        }

        // Actualizar plan a activo
        if (existingTx.plan_id) {
          const { error: planUpdateError } = await supabase
            .from("savings_plans")
            .update({ status: "activo" })
            .eq("id", existingTx.plan_id);

          if (planUpdateError) {
            console.error("❌ Error al activar plan:", planUpdateError);
          } else {
            console.log("✅ Plan activado:", existingTx.plan_id);
          }
        }

        // Actualizar wallet del usuario si no la tiene
        if (walletAddress && existingTx.savings_plans?.user_id) {
          const { error: walletError } = await supabase
            .from("users")
            .update({ wallet_address: walletAddress })
            .eq("id", existingTx.savings_plans.user_id)
            .is("wallet_address", null);

          if (!walletError) {
            console.log("✅ Wallet actualizada para usuario:", existingTx.savings_plans.user_id);
          }
        }
      } else {
        // Crear nueva transacción (pago sin pre-registro)
        const { data, error } = await supabase
          .from("transactions")
          .insert([{
            plan_id: null,
            payment_type: "aporte",
            amount: amount,
            tx_hash: orderId,
            status: "confirmado",
            payment_date: new Date().toISOString(),
          }])
          .select();

        if (error) {
          console.error("❌ Error al guardar transacción:", error);
          return res.status(500).json({ error: error.message });
        }

        console.log("💾 Nueva transacción registrada en Supabase:", data[0].id);
      }

      return res.json({ success: true });
    }

    console.log("ℹ️ Pago no confirmado o en otro estado:", payment.status);
    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    return res.status(500).json({ error: err.message });
  }
});

// === HEALTH CHECK ===
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    env_check: {
      supabase_url: !!SUPABASE_URL,
      supabase_key: !!SUPABASE_SERVICE_ROLE_KEY,
      cryptomus_api_key: !!CRYPTOMUS_API_KEY,
      cryptomus_merchant_id: !!CRYPTOMUS_MERCHANT_ID,
      cryptomus_webhook_secret: !!CRYPTOMUS_WEBHOOK_SECRET,
      api_base_url: API_BASE_URL,
    }
  });
});

// === SERVIDOR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));
