// Téléphone de l'agent : ligne WebRTC et événements d'appel du XuC
// Agent phone: WebRTC line and XuC call events
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { XUC_HOST } from './loadXivoLibs';

export type PhoneStatus = 'stopped' | 'starting' | 'ready' | 'failed';
export type CallState = 'idle' | 'ringing' | 'dialing' | 'established' | 'onHold';

interface PhoneEvent {
  eventType: string;
  uniqueId?: string;
  otherDN?: string;
  otherDNName?: string;
}

export function usePhone(
  connected: boolean,
  token: RefObject<string | null>,
  lineConfig: RefObject<unknown>,
  username: string,
) {
  const [phoneStatus, setPhoneStatus] = useState<PhoneStatus>('stopped');
  const [callState, setCallState] = useState<CallState>('idle');
  const [party, setParty] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const uniqueId = useRef<string | undefined>(undefined);

  // Événements d'appel envoyés par le XuC / Call events sent by the XuC
  useEffect(() => {
    if (!connected) return;
    Cti.setHandler(Cti.MessageType.PHONEEVENT, (ev: PhoneEvent) => {
      const who = [ev.otherDNName, ev.otherDN].filter(Boolean).join(' ');
      switch (ev.eventType) {
        case 'EventRinging':
          uniqueId.current = ev.uniqueId;
          setParty(who);
          setCallState('ringing');
          break;
        case 'EventDialing':
          uniqueId.current = ev.uniqueId;
          setParty(who);
          setCallState('dialing');
          break;
        case 'EventEstablished':
          uniqueId.current = ev.uniqueId;
          setParty(who);
          setCallState('established');
          setStartedAt((prev) => prev ?? Date.now());
          break;
        case 'EventOnHold':
          setCallState('onHold');
          break;
        case 'EventReleased':
        case 'EventFailure':
          uniqueId.current = undefined;
          setParty('');
          setCallState('idle');
          setStartedAt(null);
          break;
      }
    });
  }, [connected]);

  const startPhone = useCallback(() => {
    if (!token.current || !lineConfig.current) return;
    setPhoneStatus('starting');
    xc_webrtc.clearHandlers();
    xc_webrtc.setHandler(xc_webrtc.MessageType.REGISTRATION, (event: unknown) => {
      const text = JSON.stringify(event).toLowerCase();
      if (text.includes('registered') && !text.includes('unregistered')) setPhoneStatus('ready');
      else if (text.includes('fail') || text.includes('error')) setPhoneStatus('failed');
    });
    const [host, port] = XUC_HOST.split(':');
    xc_webrtc.initByLineConfig(lineConfig.current, username, true, port || 443, token.current, 'audio_remote', host);
  }, [token, lineConfig, username]);

  const dial = useCallback((number: string) => xc_webrtc.dial(number), []);
  const answer = useCallback(() => xc_webrtc.answer(), []);
  const hangup = useCallback(() => Cti.hangup(uniqueId.current), []);
  const hold = useCallback(() => Cti.hold(uniqueId.current), []);

  return { phoneStatus, callState, party, startedAt, startPhone, dial, answer, hangup, hold };
}
