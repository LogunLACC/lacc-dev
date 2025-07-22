/* -------------------------------------------------------------
   LACC Phase 3 – Events Feed Carousel
   -------------------------------------------------------------
   • Fetches events from /data/events.json (static in repo)
   • Renders Swiper.js carousel (autoplay + swipe/drag)
   • Each slide: event date badge + title + optional description
---------------------------------------------------------------- */

import Swiper, { Navigation, Pagination, Autoplay } from "https://cdn.jsdeliver.net/npm/swiper@11/swiper-bundle.min.mjs";

window.addEventListener("DOMContentLoaded", async () => {
  const wrap = document.getElementById("eventsCarousel");
  if (!wrap) return;

  try {
    const res   = await fetch("data/events.json");
    const events = await res.json();

    // build slides
    const slides = events.map(ev => {
      const date = new Date(ev.date);
      const options = { month:"short", day:"numeric" };
      const dayStr = date.toLocaleDateString(undefined, options);

      return `<div class="swiper-slide">
        <article class="event-card">
          <span class="event-date">${dayStr}</span>
          <h3>${ev.title}</h3>
          ${ev.desc ? `<p>${ev.desc}</p>` : ""}
        </article>
      </div>`;
    }).join("");

    wrap.querySelector(".swiper-wrapper").innerHTML = slides;

    // init Swiper
    new Swiper("#eventsCarousel", {
      modules:[Navigation, Pagination, Autoplay],
      slidesPerView:1,
      spaceBetween:16,
      loop:true,
      autoplay:{ delay:5000, disableOnInteraction:false },
      pagination:{ el:".swiper-pagination", clickable:true },
      navigation:{ nextEl:".swiper-button-next", prevEl:".swiper-button-prev" },
      breakpoints:{
        640:{ slidesPerView:2 },
        1024:{ slidesPerView:3 }
      }
    });
  } catch (err) {
    console.error("Events carousel error", err);
    wrap.innerHTML = "<p style=\"text-align:center\">Events feed unavailable.</p>";
  }
});
