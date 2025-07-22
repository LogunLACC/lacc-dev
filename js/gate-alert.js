const URL   = 'data/gate-status.json';
const CHECK = 5 * 60 * 1000;      // 5‑min poll
let toast;

function makeToast(txt, level = 'danger') {
  if (toast) toast.remove();
  toast = document.createElement('div');
  toast.textContent = txt;
  toast.style.cssText = `
    position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);
    padding:.7rem 1.4rem;border-radius:8px;font-weight:600;z-index:1001;
    color:#fff;background:${level === 'delay' ? '#e37b40' : '#dc2626'};
    box-shadow:0 4px 10px rgba(0,0,0,.2);`;
  document.body.appendChild(toast);
}

async function checkGate() {
  try {
    const res = await fetch(URL, { cache: 'no-store' });
    if (!res.ok) return;
    const { status, gate, until, message } = await res.json();

    if (status && status !== 'open') {
      const txt = `${gate} Gate ${status.toUpperCase()} — ${message || 'Please use alternate route.'}` +
                  (until ? ` (Expected clear ${new Date(until).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})` : '');
      makeToast(txt, status);
    } else if (toast) {
      toast.remove();
      toast = null;
    }
  } catch (e) {
    console.warn('Gate alert fetch failed', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkGate();
  setInterval(checkGate, CHECK);
});
