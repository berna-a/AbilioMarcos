// Meta Pixel com consentimento (RGPD): só carrega APÓS consentimento de marketing.
const PIXEL_ID = "1789018475404986";

export function loadMetaPixel() {
  const w = window as any;
  if (w.fbq) return; // já carregado
  /* eslint-disable */
  const n: any = (w.fbq = function () {
    n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  const t = document.createElement("script");
  t.async = true;
  t.src = "https://connect.facebook.net/en_US/fbevents.js";
  const s = document.getElementsByTagName("script")[0];
  s.parentNode!.insertBefore(t, s);
  /* eslint-enable */
  w.fbq("init", PIXEL_ID);
  w.fbq("track", "PageView");
}
