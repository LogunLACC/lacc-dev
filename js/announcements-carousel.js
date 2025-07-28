window.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('#alertsCarousel .swiper-wrapper');
  if (!wrapper) return;

  try {
    const res = await fetch('data/alerts.json');
    let alerts = await res.json();
    if (!Array.isArray(alerts)) alerts = [alerts];

    wrapper.innerHTML = alerts.map(a => `
      <div class="swiper-slide">
        <article class="announce-card ${a.level || 'info'}">
          <p>${a.message}</p>
        </article>
      </div>
    `).join('');

    new Swiper('#alertsCarousel', {
      slidesPerView: 1,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '#alertsCarousel .swiper-pagination', clickable: true }
    });
  } catch (err) {
    console.error('Announcements error', err);
    wrapper.innerHTML = '<p style="grid-column:1/-1;text-align:center">Announcements unavailable.</p>';
  }
});
