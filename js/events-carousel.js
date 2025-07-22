/* -------------------------------------------------------------
   LACC Phase 3 – Events Feed Carousel (Global Swiper build)
   -------------------------------------------------------------
   • Fetches events from /data/events.json
   • Uses Swiper 11 global build loaded via <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>
---------------------------------------------------------------- */

window.addEventListener('DOMContentLoaded', async () => {
  const wrapper = document.querySelector('#eventsCarousel .swiper-wrapper');
  if (!wrapper) return;

  try {
    const res    = await fetch('data/events.json');
    const events = await res.json();

    // Build slide markup
    wrapper.innerHTML = events.map(ev => {
      const date = new Date(ev.date);
      const badge = date.toLocaleDateString(undefined, { month:'short', day:'numeric' });
      return `<div class="swiper-slide">
                <article class="event-card">
                  <span class="event-date">${badge}</span>
                  <h3>${ev.title}</h3>
                  ${ev.desc ? `<p>${ev.desc}</p>` : ''}
                </article>
              </div>`;
    }).join('');

    // Init Swiper (global)
    new Swiper('#eventsCarousel', {
      slidesPerView:1,
      spaceBetween:16,
      loop:true,
      autoplay:{ delay:5000, disableOnInteraction:false },
      pagination:{ el:'.swiper-pagination', clickable:true },
      navigation:{ nextEl:'.swiper-button-next', prevEl:'.swiper-button-prev' },
      breakpoints:{ 640:{ slidesPerView:2 }, 1024:{ slidesPerView:3 } }
    });
  } catch (err) {
    console.error('Events feed error', err);
    wrapper.innerHTML = '<p style="grid-column:1/-1;text-align:center">Events feed unavailable.</p>';
  }
});
