// ---------- Scroll‑Reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); obs.unobserve(e.target); } });
});
revealEls.forEach(el => observer.observe(el));

// ---------- Parallax ----------
const parallaxEls = document.querySelectorAll('[data-parallax]');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.3;
    el.style.transform = `translateY(${y * speed}px)`;
  });
});

// ---------- Dark‑mode toggle + sparkle burst ----------
const themeToggle = document.getElementById('themeToggle');
const setTheme = t => { document.documentElement.setAttribute('data-theme', t); localStorage.setItem('theme', t); };
setTheme(localStorage.getItem('theme') || 'light');

themeToggle.addEventListener('click', e => {
  document.body.classList.add('theme-transition');
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
  setTimeout(() => document.body.classList.remove('theme-transition'), 500);
  sparkleBurst(e.clientX, e.clientY);
});

function sparkleBurst(x, y) {
  const colors = ['#ffffff', '#fffae0', '#e3f7ff'];
  for (let i = 0; i < 10; i++) {
    const dot = document.createElement('span');
    dot.className = 'burst';
    dot.style.background = colors[Math.random() * colors.length | 0];
    dot.style.left = `${x}px`;
    dot.style.top  = `${y}px`;
    document.body.appendChild(dot);

    const angle = Math.random() * 2 * Math.PI;
    const dist  = 120 + Math.random() * 60;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    dot.animate([
      { transform:'translate(0,0)', opacity:1 },
      { transform:`translate(${dx}px,${dy}px)`, opacity:0 }
    ], { duration:700, easing:'cubic-bezier(.4,0,.2,1)', fill:'forwards' })
    .onfinish = () => dot.remove();
  }
}
