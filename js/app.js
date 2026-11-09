const places = [
  { name: "Hauz Khas", date: "21 September 2026 · Our first meeting", coords: [28.5494, 77.2001],
    story: "After days of conversations, we finally met in person. We spent the afternoon talking, laughing, flirting and walking around, shared songs and earbuds, had chai together, and talked about the lives that shaped us. Somewhere in those conversations, I told you I liked you." },
  { name: "Deer Park", date: "2 October 2026 · Finding our way back", coords: [28.5548, 77.1962],
    story: "We met after a difficult moment, sat together, talked things through and tried to understand each other. We chose to work through what had happened instead of letting it define our story. And we kissed. Some memories don't need photographs. I remember that day by heart." },
  { name: "Sanjay Van", date: "5 November 2026 · A day in the trees", coords: [28.5357, 77.1847],
    story: "A day of forest paths, a waterfall, food, conversations and a trek. We found a spot overlooking the forest and sat on the cliff for almost two hours. The ride back was peaceful, with you asleep in my arms." },
  { name: "Rajiv Chowk", date: "Our Rajiv Chowk moments", coords: [28.6328, 77.2197],
    story: "Rajiv Chowk became our go-to place for a little while. Random plans, unexpected meetings and the time we spent together made it feel familiar. It is a place we'll keep returning to, with more memories still waiting to be made." },
  { name: "V3S Mall", date: "Our unexpected meetings", coords: [28.6375, 77.2867],
    story: "V3S is part of the places named in our story: the first-meeting chapter places our first meeting here, and our little-moments chapter remembers surprise visits and unexpected meet-ups. A place for another reason to see you." },
  { name: "Sagarpur", date: "A place saved on our map", coords: [28.5960, 77.0855],
    story: "Sagarpur has its own pin on our map. Its personal story has not been written into the timeline yet, so this marker is waiting for the memory you want to attach to it." }
];

const map = L.map("memoryMap", { scrollWheelZoom: false, preferCanvas: true })
  .fitBounds(places.map(place => place.coords), { padding: [30, 30], maxZoom: 12 });

const attribution = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a> | Data sources: Esri, OpenStreetMap contributors';
const streetTiles = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, attribution }
);
const topoTiles = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19, attribution }
);
let fallbackUsed = false;
streetTiles.on("tileerror", () => {
  if (!fallbackUsed) { fallbackUsed = true; map.removeLayer(streetTiles); topoTiles.addTo(map); }
});
streetTiles.addTo(map);

const icon = L.divIcon({
  className: "", html: '<div class="memory-pin"><span>♡</span></div>',
  iconSize: [29, 29], iconAnchor: [15, 27]
});
const detail = document.getElementById("memoryDetail");
places.forEach(place => {
  const marker = L.marker(place.coords, { icon }).addTo(map);
  marker.bindPopup(`<b>${place.name}</b><br><span>${place.date}</span><br><span>Tap to read this memory ♡</span>`);
  marker.on("click", () => {
    detail.innerHTML = `<small>${place.date.toUpperCase()}</small><h3>${place.name}</h3><p>${place.story}</p>`;
  });
});

if ("ResizeObserver" in window) {
  new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById("memoryMap"));
}
window.addEventListener("resize", () => map.invalidateSize());

document.querySelectorAll(".photo[data-src]").forEach(element => {
  const source = element.dataset.src.replace(/\\/g, "/");
  const alt = (element.textContent || "A photograph from our story").trim();
  const image = document.createElement("img");
  image.className = "photo-image";
  image.src = source; image.alt = alt;
  image.loading = "lazy"; image.decoding = "async";
  image.onerror = () => {
    const fallback = document.createElement("div");
    fallback.className = "photo-placeholder";
    fallback.textContent = `Photo not found: ${source}`;
    element.replaceWith(fallback);
  };
  element.replaceWith(image);
});

const audio = document.getElementById("song");
const button = document.getElementById("musicBtn");
button.onclick = async () => {
  try {
    if (audio.paused) { await audio.play(); button.textContent = "♫ Pause our song"; }
    else { audio.pause(); button.textContent = "♫ Play our song"; }
  } catch (error) { button.textContent = "Song unavailable"; }
};
audio.addEventListener("ended", () => button.textContent = "♫ Play our song");
document.getElementById("openLetter").onclick = () => {
  document.getElementById("letterPaper").hidden = false;
  document.getElementById("letterPaper").scrollIntoView({ behavior: "smooth", block: "center" });
};
