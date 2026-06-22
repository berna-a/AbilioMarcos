// Microsoft Clarity com consentimento (RGPD): carrega só APÓS consentimento de
// "analytics". O ID vem da env VITE_CLARITY_ID (definida no .env.local e no Vercel).
// Sem ID configurado, é um no-op — seguro para deployar antes de existir a conta Clarity.
const CLARITY_ID = (import.meta.env.VITE_CLARITY_ID as string | undefined)?.trim();

export function loadClarity() {
  if (!CLARITY_ID) return; // sem ID → não faz nada
  const w = window as any;
  if (typeof w.clarity === 'function') return; // já carregado (idempotente)
  /* eslint-disable */
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(w, document, "clarity", "script", CLARITY_ID);
  /* eslint-enable */
}
