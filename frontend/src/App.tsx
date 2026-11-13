import { useTranslation } from 'react-i18next';

const LANGUAGES = ['fr', 'en'] as const;

function App() {
  const { t, i18n } = useTranslation();

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <h1>{t('app.welcome')}</h1>
      <p>{t('app.subtitle')}</p>
      <p>{t('app.status')}</p>
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
