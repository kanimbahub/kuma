import { useTranslation } from 'react-i18next';
import { LoginForm } from './components/LoginForm';
import { useXuc } from './xivo/useXuc';

const LANGUAGES = ['fr', 'en'] as const;

function App() {
  const { t, i18n } = useTranslation();
  const xuc = useXuc();

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem', textAlign: 'center' }}>
      <h1>{t('app.welcome')}</h1>
      <p>{t('app.subtitle')}</p>

      {xuc.status === 'connected' && xuc.agent ? (
        <section>
          <p>{t('agent.connected', { username: xuc.agent.username, phone: xuc.agent.phone })}</p>
          <p>{xuc.lineReady ? t('agent.lineReady') : t('agent.lineWaiting')}</p>
        </section>
      ) : (
        <LoginForm
          status={xuc.status}
          errorKey={xuc.errorKey}
          onSubmit={(username, password, phone) => void xuc.login(username, password, phone)}
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
    </main>
  );
}

export default App;
