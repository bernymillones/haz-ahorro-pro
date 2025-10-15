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
const CRYPTOMUS_WEBHOOK_SECRET = process.env.CRYPTOMUS_WEBHOOK_SECRET;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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
      const amount = payment.amount;
      const currency = payment.currency || "USD";
      const walletAddress = payment.payer_address || null;

      // Registrar en Supabase
      const { data, error } = await supabase.from("transactions").insert([
        {
          plan_id: null,
          payment_type: "aporte",
          amount: amount,
          tx_hash: orderId,
          status: "confirmado",
          details: { currency, walletAddress },
        },
      ]);

      if (error) {
        console.error("Error al guardar transacción:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("💾 Transacción registrada correctamente en Supabase.");
      return res.json({ success: true });
    }

    console.log("ℹ️ Pago no confirmado o en otro estado:", payment.status);
    return res.json({ received: true });
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    return res.status(500).json({ error: err.message });
  }
});

// === SERVIDOR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook activo en puerto ${PORT}`));

