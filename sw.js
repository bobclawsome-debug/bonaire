// Our Bonaire Trip service worker: offline app shell + data. Map tiles stay online-only.
const V='bonaire-v4';
const SHELL=['./','index.html','style.css','app.js','map.html','manifest.json','data/trip.json','data/sites.json','data/diving.json','data/deals.json','data/info.json','data/rentals.json','data/itinerary.json','data/activities.json','activities.js','img/activities/bio-snorkel.jpg','img/activities/cadushy.jpg','img/activities/dpv.jpg','img/activities/efoil.jpg','img/activities/caves.jpg','img/activities/donkey.jpg','img/activities/echo.jpg','img/activities/flamingo.jpg','img/activities/food-tour.jpg','img/activities/gotomeer.jpg','img/activities/horse.jpg','img/activities/kite.jpg','img/activities/klein.jpg','img/activities/landsail.jpg','img/activities/mangrove-kayak.jpg','img/activities/mtb.jpg','img/activities/night-kayak.jpg','img/activities/seru-largu.jpg','img/activities/south-loop.jpg','img/activities/spa.jpg','img/activities/sunset-sail.jpg','img/activities/utv.jpg','img/activities/windsurf.jpg','img/activities/wsnp-guided.jpg','img/activities/wsnp.jpg','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET')return;
  // tiles: network only
  if(/tile\.openstreetmap\.org|arcgisonline\.com/.test(u.host))return;
  const sameOrigin=u.origin===location.origin, leaflet=u.host==='unpkg.com';
  if(!sameOrigin&&!leaflet)return;
  // network-first so updates show up; fall back to cache offline
  e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?caches.match('index.html'):undefined))));
});
