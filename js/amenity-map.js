/* -------------------------------------------------------------
   LACC Phase 3 – Interactive Amenity Map (Leaflet.js)
   -------------------------------------------------------------
   • Uses Leaflet + OSM tiles (no API key).
   • Pins hover‑bounce + click popup with amenity name & NAV link.
   • Map container: <div id="amenityMap"></div> – 100% width / 500px height.
---------------------------------------------------------------- */

// Default amenity data (lat, lng, name) used if fetch fails
const defaultAmenities = [
  { name: "Golf Course & Clubhouse",        lat: 40.24763,           lng: -121.15100 },
  { name: "Bandshell – Music Under the Stars", lat: 40.24541,         lng: -121.144411 },
  { name: "Sports Center – Rec 1",          lat: 40.24631,           lng: -121.14436 },
  { name: "Rec 1 – Boat Launch",            lat: 40.2423715315,      lng: -121.1427536425 },
  { name: "Rec 2",                           lat: 40.2392896501,      lng: -121.1505879180 },
  { name: "Rec 3 – Frisbee Golf",           lat: 40.2489205279,      lng: -121.1429040060 },
  { name: "Peninsula Gate",                 lat: 40.2695793687,      lng: -121.1264990975 },
  { name: "LACC Admin Office",              lat: 40.2695982993,      lng: -121.1268994172 },
  { name: "Main Gate – Clifford Gate (Security)", lat: 40.2630407497,  lng: -121.1478179403 }
];

// Initialize map once DOM loads
window.addEventListener("DOMContentLoaded", async () => {
  const mapEl = document.getElementById("amenityMap");
  if (!mapEl) return;

  // Load amenity data
  let amenities = defaultAmenities;
  try {
    const res = await fetch('data/amenities.json');
    if (res.ok) amenities = await res.json();
  } catch (e) { console.warn('Amenity data fetch failed', e); }

  // Basic Leaflet init
  const map = L.map("amenityMap", {
    center: [40.24763, -121.15100], // starting center
    zoom: 13,
    scrollWheelZoom: false
  });

  // OSM tiles (free) – you can swap for Mapbox style later
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Marker icon (sunset orange)
  const markerIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", // default blue
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
  });

  // Add markers
  amenities.forEach(({ name, lat, lng, img, hours, booking }) => {
    const m = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
    const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    let html = `<strong>${name}</strong>`;
    if (img) html += `<br><img src='${img}' alt='${name}' />`;
    if (hours) html += `<br><small>${hours}</small>`;
    if (booking) html += `<br><a href='${booking}' target='_blank' rel='noopener'>Book Now</a>`;
    html += `<br><a href='${gmaps}' target='_blank' rel='noopener'>Get Directions</a>`;
    m.bindPopup(html);
  });

  // Fit all pins
  const group = new L.featureGroup(amenities.map(a => L.marker([a.lat, a.lng])));
  map.fitBounds(group.getBounds(), { padding: [40, 40] });
});
