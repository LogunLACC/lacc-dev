/* -------------------------------------------------------------
   LACC Phase 4 – Alert Toast
   -------------------------------------------------------------
   • Loads alerts from alerts.json every 5 min
   • level ∈ "info" | "warning" | "danger" (red)
   • Auto‑dismiss after 30 s; swipe‑to‑close on mobile
---------------------------------------------------------------- */

const ALERT_URL     = 'data/alerts.json';
const POLL_INTERVAL = 5 * 60 * 1000;             // refresh every 5 min
const ALERT_LEVEL = {
  info:    { bg:'#2563eb', txt:'#fff' },        // blue
  warning: { bg:'#e37b40', txt:'#fff' },        // sunset orange
  danger:  { bg:'#dc2626', txt:'#fff' }         // red
};

let toast, lastMsg;

function renderToast(message, level='info') {
  const styles = ALERT_LEVEL[level] || ALERT_LEVEL.info;
  if (toast) toast.remove();
  toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;top:1rem;left:50%;transform:translateX(-50%) translateY(-120%);
    background:${styles.bg};color:${styles.txt};
    padding:.75rem 1.25rem;border-radius:8px;font-weight:600;z-index:1000;
    box-shadow:0 4px 12px rgba(0,0,0,.15);transition:transform .4s ease;touch-action:none;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(()=> toast.style.transform = 'translateX(-50%) translateY(0)');

  const hide = () => {
    toast.style.transform = 'translateX(-50%) translateY(-120%)';
    toast.addEventListener('transitionend', () => toast.remove(), { once:true });
    clearTimeout(timer);
  };

  let startY;                                // swipe to dismiss
  toast.addEventListener('touchstart', e => startY = e.touches[0].clientY, { passive:true });
  toast.addEventListener('touchend',   e => {
    if (startY - e.changedTouches[0].clientY > 40) hide();
  });
  toast.addEventListener('click', hide);     // also close on click

  const timer = setTimeout(hide, 30000);     // auto-dismiss 30 s
}

function handleAlert(alert) {
  if (!alert || alert.message === lastMsg) return;
  lastMsg = alert.message;
  renderToast(alert.message, alert.level);
}

async function loadAlerts() {
  try {
    const res = await fetch(ALERT_URL, { cache:'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const alerts = await res.json();
    alerts.forEach(handleAlert);
  } catch (err) {
    console.error('Failed to load alerts.json', err);
  }
}

function startAlerts() {
  loadAlerts();
  setInterval(loadAlerts, POLL_INTERVAL);
}

document.addEventListener('DOMContentLoaded', startAlerts);
