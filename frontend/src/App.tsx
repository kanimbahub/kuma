import { useTranslation } from 'react-i18next';
import { LoginForm } from './components/LoginForm';
import { PhonePanel } from './components/PhonePanel';
import { usePhone } from './xivo/usePhone';
import { useXuc } from './xivo/useXuc';

const LANGUAGES = ['fr', 'en'] as const;

function App() {
  const { t, i18n } = useTranslation();
  const xuc = useXuc();
  const connected = xuc.status === 'connected' && xuc.agent !== null;
  const phone = usePhone(connected, xuc.token, xuc.lineConfig, xuc.agent?.username ?? '');

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <h1>{t('app.welcome')}</h1>
      <p>{t('app.subtitle')}</p>

      {connected && xuc.agent ? (
        <section>
          <p>{t('agent.connected', { username: xuc.agent.username, phone: xuc.agent.phone })}</p>
          {phone.phoneStatus !== 'ready' && (
            <p>{xuc.lineReady ? t('agent.lineReady') : t('agent.lineWaiting')}</p>
          )}
          <PhonePanel
            lineReady={xuc.lineReady}
            phoneStatus={phone.phoneStatus}
            callState={phone.callState}
            party={phone.party}
            startedAt={phone.startedAt}
            onStart={phone.startPhone}
            onDial={phone.dial}
            onAnswer={phone.answer}
            onHangup={phone.hangup}
            onHold={phone.hold}
          />
        </section>
      ) : (
        <LoginForm
          status={xuc.status}
          errorKey={xuc.errorKey}
          onSubmit={(username, password, phoneNumber) => void xuc.login(username, password, phoneNumber)}
        />
      )}

      <div role="group" aria-label={t('language.label')}>
        {LANGUAGES.map((lng) => (
          <button
            key={lng}
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            disabled={i18n.resolvedLanguage === lng}
            style={{ margin: '0 0.5rem' }}
          >
            {t(`language.${lng}`)}
          </button>
        ))}
      </div>

      {/* Son de l'appel / Call audio */}
      <audio id="audio_remote" autoPlay />
    </main>
  );
}

export default App;
