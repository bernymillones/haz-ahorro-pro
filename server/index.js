// server/index.js
import express from 'express';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

app.post('/create-subscription', async (req, res) => {
  try {
    const { user_email, plan_type, amount, monthly_yield, months_duration = 12, external_order_id } = req.body;

    if (!user_email || !plan_type || !amount || !monthly_yield) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Buscar (o crear) usuario en tabla users basado en email
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', user_email)
      .limit(1);

    let user_id;
    if (existingUser && existingUser.length > 0) {
      user_id = existingUser[0].id;
    } else {
      const { data: newUser, error: uErr } = await supabase
        .from('users')
        .insert([{ email: user_email, name: null }])
        .select()
        .single();
      if (uErr) throw uErr;
      user_id = newUser.id;
    }

    // Crear la suscripción
    const { data: subscription, error: sErr } = await supabase
      .from('savings_plans')
      .insert([{
        user_id,
        plan_type,
        amount,
        monthly_yield,
        months_duration,
        start_date: new Date().toISOString().slice(0,10),
        status: 'activo',
      }])
      .select()
      .single();

    if (sErr) throw sErr;

    // Registrar la transacción de compra (opcional)
    await supabase.from('transactions').insert([{
      plan_id: subscription.id,
      payment_type: 'aporte',
      amount,
      tx_hash: external_order_id || null,
      status: 'pendiente'
    }]);

    return res.json({ success: true, subscription });
  } catch (err) {
    console.error('create-subscription error', err);
    return res.status(500).json({ error: err.message || err });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
