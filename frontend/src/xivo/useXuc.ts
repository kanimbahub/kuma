// Connexion de l'agent au XuC : jeton REST, puis WebSocket CTI
// Agent connection to the XuC: REST token, then CTI WebSocket
import { useCallback, useRef, useState } from 'react';
import { loadXivoLibs, XUC_HOST } from './loadXivoLibs';

export type XucStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface Agent {
  username: string;
  phone: string;
}

function toErrorKey(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.startsWith('lib:')) return 'login.error.libs';
  if (['400', '401', '403'].includes(message)) return 'login.error.credentials';
  return 'login.error.network';
}

export function useXuc() {
  const [status, setStatus] = useState<XucStatus>('idle');
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [lineReady, setLineReady] = useState(false);
  const token = useRef<string | null>(null);
  const lineConfig = useRef<unknown>(null);

  const login = useCallback(async (username: string, password: string, phone: string) => {
    setErrorKey(null);
    setLineReady(false);
    setStatus('connecting');
    try {
      await loadXivoLibs();
      const response = await fetch(`https://${XUC_HOST}/xuc/api/2.0/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: username, password }),
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = (await response.json()) as { token: string };
      token.current = data.token;
      setAgent({ username, phone });

      Cti.debugMsg = false;
      Cti.clearHandlers();
      Cti.setHandler(Cti.MessageType.LOGGEDON, () => setStatus('connected'));
      Cti.setHandler(Cti.MessageType.LINECONFIG, (config: unknown) => {
        lineConfig.current = config;
        setLineReady(true);
      });
      Cti.setHandler(Cti.MessageType.LINKSTATUSUPDATE, (event: { status?: string }) => {
        if (event?.status === 'closed') {
          setStatus('error');
          setErrorKey('login.error.lost');
          setLineReady(false);
        }
      });
      Cti.setHandler(Cti.MessageType.ERROR, (event: unknown) => console.error('XuC', event));
      Cti.WebSocket.init(`wss://${XUC_HOST}/xuc/api/2.0/cti?token=${data.token}`, username, phone);
    } catch (err) {
      setStatus('error');
      setErrorKey(toErrorKey(err));
    }
  }, []);

  return { status, errorKey, agent, lineReady, token, lineConfig, login };
}
