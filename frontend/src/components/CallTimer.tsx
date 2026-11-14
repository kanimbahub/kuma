import { useEffect, useState } from 'react';

// Durée de l'appel au format mm:ss / Call duration as mm:ss
export function CallTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = Math.max(0, Math.floor((now - startedAt) / 1000));
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return <span style={{ fontFamily: 'ui-monospace, monospace' }}>{mm}:{ss}</span>;
}
