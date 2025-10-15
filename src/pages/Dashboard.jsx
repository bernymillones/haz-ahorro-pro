// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useParentUser } from '../hooks/useParentUser';
import { supabase } from '../lib/supabaseClient';
import { useMySubscriptions } from '../hooks/useMySubscriptions';

export default function Dashboard() {
  const parentUser = useParentUser(); // { email }
  const [userId, setUserId] = useState<string | null>(null);
  const { subscriptions, loading } = useMySubscriptions(userId || undefined);

  useEffect(() => {
    if (!parentUser?.email) return;
    (async () => {
      // Resolve local user id from Supabase by email (read-only)
      const { data, error } = await supabase
        .from('users')
        .select('id,email')
        .eq('email', parentUser.email)
        .limit(1);
      if (error) {
        console.error(error);
        return;
      }
      if (data && data.length > 0) {
        setUserId(data[0].id);
      } else {
        // If no user exist yet, create a lightweight record (optionally)
        const { data: newUser } = await supabase
          .from('users')
          .insert([{ email: parentUser.email, name: parentUser.name || null }])
          .select()
          .single();
        setUserId(newUser.id);
      }
    })();
  }, [parentUser]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Mi panel de Ahorros</h2>
      {!parentUser?.email && <div>Pidiendo sesión al sistema principal...</div>}
      {parentUser?.email && (
        <>
          <div className="mb-4">Usuario: {parentUser.email}</div>

          {loading ? (
            <div>Cargando suscripciones...</div>
          ) : (
            <div>
              {subscriptions.length === 0 ? (
                <div>No tienes planes activos.</div>
              ) : (
                subscriptions.map((s) => (
                  <div key={s.id} className="p-4 mb-3 rounded bg-white/5">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{s.plan_type}</div>
                        <div>Monto: ${s.amount}</div>
                        <div>Inicio: {new Date(s.start_date).toLocaleDateString()}</div>
                        <div>Mensual: {s.monthly_yield}%</div>
                        <div>Estado: {s.status}</div>
                      </div>
                      <div className="text-right">
                        <div>Meses: {s.months_duration}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
