// Charge les bibliothèques officielles XiVO depuis le XuC, dans l'ordre de la page d'exemple
// Loads the official XiVO libraries from the XuC, in the sample page order
export const XUC_HOST: string = import.meta.env.VITE_XUC_HOST ?? '';

const LIBS = ['jquery-2.0.3.js', 'shotgun.js', 'SIPml-api.js', 'cti.js', 'xc_webrtc.js'];

let loading: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`lib:${src}`));
    document.head.appendChild(script);
  });
}

export function loadXivoLibs(): Promise<void> {
  if (!loading) {
    const base = `https://${XUC_HOST}/xucassets/javascripts/`;
    loading = LIBS.reduce<Promise<void>>((chain, lib) => chain.then(() => loadScript(base + lib)), Promise.resolve());
    loading.catch(() => { loading = null; });
  }
  return loading;
}
