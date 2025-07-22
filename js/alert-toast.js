/* -------------------------------------------------------------
   LACC Quick‑Prototype – Member Alert Toast
   -------------------------------------------------------------
   • Fetches /data/alerts.json { message, level }
   • level ∈ "info" | "warning" | "danger" (red)
   • Builds a slide‑in toast top‑center, auto‑dismiss after 12s
---------------------------------------------------------------- */

const ALERT_URL   = 'data/alerts.json';
const ALERT_LEVEL = {
  info:    { bg:'#2563eb', txt:'#fff' },      // blue
  warning: { bg:'#e37b40', txt:'#fff' },      // sunset orange
  danger:  { bg:'#dc2626', txt:'#fff' }       // red
};

async function showAlert() {
  try {
    const res = await fetch(ALERT_URL, { cache: 'no-store' });
    if (!res.ok) return;  // no alert file
    const alert = await res.json();
    if (!alert.message) return;

    const { message, level = 'info' } = alert;
    const styles = ALERT_LEVEL[level] || ALERT_LEVEL.info;

    // Build toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed;top:1rem;left:50%;transform:translateX(-50%) translateY(-120%);
      background:${styles.bg};color:${styles.txt};
      padding:.75rem 1.25rem;border-radius:8px;font-weight:600;z-index:1000;
      box-shadow:0 4px 12px rgba(0,0,0,.15);transition:transform .4s ease;
    `;
    document.body.appendChild(toast);

    // slide in
    requestAnimationFrame(()=> toast.style.transform = 'translateX(-50%) translateY(0)');

    // auto dismiss
    setTimeout(()=>{
      toast.style.transform = 'translateX(-50%) translateY(-120%)';
      toast.addEventListener('transitionend', ()=> toast.remove());
    }, 12000);
  } catch(err) {
    console.warn('Alert toast fetch failed', err);
  }
}

document.addEventListener('DOMContentLoaded', showAlert);
