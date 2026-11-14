import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { XucStatus } from '../xivo/useXuc';

interface Props {
  status: XucStatus;
  errorKey: string | null;
  onSubmit: (username: string, password: string, phone: string) => void;
}

export function LoginForm({ status, errorKey, onSubmit }: Props) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const busy = status === 'connecting';

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(username, password, phone); }}
      style={{ display: 'grid', gap: '0.75rem', maxWidth: 320, margin: '2rem auto', textAlign: 'left' }}
    >
      <h2 style={{ textAlign: 'center' }}>{t('login.title')}</h2>
      <label>
        {t('login.username')}
        <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required style={{ width: '100%' }} />
      </label>
      <label>
        {t('login.password')}
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required style={{ width: '100%' }} />
      </label>
      <label>
        {t('login.phone')}
        <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" required style={{ width: '100%' }} />
      </label>
      <button type="submit" disabled={busy}>{busy ? t('login.loading') : t('login.submit')}</button>
      {errorKey && <p role="alert" style={{ color: '#f87171' }}>{t(errorKey)}</p>}
    </form>
  );
}
