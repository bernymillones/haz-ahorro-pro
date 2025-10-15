// src/hooks/useParentUser.ts
import { useEffect, useState } from 'react';

export function useParentUser() {
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    // Envía petición al padre para solicitar datos
    window.parent.postMessage({ type: 'request_user_info' }, '*');

    function onMessage(e: MessageEvent) {
      if (!e.data) return;
      const { type, payload } = e.data;
      if (type === 'response_user_info') {
        setUser(payload);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return user;
}
