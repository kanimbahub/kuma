import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CallState, PhoneStatus } from '../xivo/usePhone';
import { CallTimer } from './CallTimer';

interface Props {
  lineReady: boolean;
  phoneStatus: PhoneStatus;
  callState: CallState;
  party: string;
  startedAt: number | null;
  onStart: () => void;
  onDial: (number: string) => void;
  onAnswer: () => void;
  onHangup: () => void;
  onHold: () => void;
}

const box = { margin: '1.5rem auto', maxWidth: 420 };
const banner = { border: '2px solid #f59e0b', borderRadius: 12, padding: '1rem', margin: '1rem 0' };

export function PhonePanel(p: Props) {
  const { t } = useTranslation();
  const [number, setNumber] = useState('');
  const who = p.party || t('phone.unknownCaller');

  if (p.phoneStatus !== 'ready') {
    return (
      <section style={box}>
        <button type="button" onClick={p.onStart} disabled={!p.lineReady || p.phoneStatus === 'starting'}>
          {p.phoneStatus === 'starting' ? t('phone.starting') : t('phone.start')}
        </button>
        {p.phoneStatus === 'failed' && <p role="alert" style={{ color: '#f87171' }}>{t('phone.failed')}</p>}
      </section>
    );
  }

  return (
    <section style={box}>
      <p>{t('phone.ready')}</p>
      {p.callState === 'idle' && (
        <form onSubmit={(e) => { e.preventDefault(); if (number) p.onDial(number); }}>
          <label>
            {t('phone.number')} <input value={number} onChange={(e) => setNumber(e.target.value)} inputMode="tel" />
          </label>{' '}
          <button type="submit">{t('phone.call')}</button>
        </form>
      )}
      {p.callState === 'ringing' && (
        <div role="alert" style={banner}>
          <p><strong>{t('phone.incoming', { caller: who })}</strong></p>
          <button type="button" onClick={p.onAnswer}>{t('phone.answer')}</button>{' '}
          <button type="button" onClick={p.onHangup}>{t('phone.decline')}</button>
        </div>
      )}
      {(p.callState === 'dialing' || p.callState === 'established' || p.callState === 'onHold') && (
        <div>
          <p>
            {t(`phone.state.${p.callState}`, { party: who })}{' '}
            {p.startedAt && <CallTimer startedAt={p.startedAt} />}
          </p>
          <button type="button" onClick={p.onHangup}>{t('phone.hangup')}</button>{' '}
          {p.callState !== 'dialing' && (
            <button type="button" onClick={p.onHold}>
              {p.callState === 'onHold' ? t('phone.resume') : t('phone.hold')}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
