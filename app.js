'use strict';
const TABS=[['home','🏝️','Home'],['map','🗺️','Map'],['itinerary','📅','Plan'],['diving','🤿','Diving'],['food','🍴','Food'],['deals','🎟️','Deals'],['rentals','📷','Rentals'],['info','ℹ️','Info']];
const CATS={hotel:['Our hotel','#d50000'],shore:['Shore dive','#1e88e5'],advanced:['Advanced','#212121'],boat:['Boat only (Klein Bonaire)','#8e24aa'],restricted:['Restricted (permit/guided)','#fb8c00'],services:['Shops, stay, airport, hospital','#2e7d32'],food_cheap:['Cheap / local','#00897b'],food_mid:['Mid-range','#f9a825'],food_splurge:['Splurge','#5d4037'],groceries:['Groceries','#7cb342']};
const VC={'Must try':'#2e7d32','Good':'#1565c0','OK':'#757575','Skip':'#e65100'};
const D={};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dir=(lat,lon)=>`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
const link=(u,t)=>u?`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t||u.replace(/^https?:\/\/(www\.)?/,'').split('/')[0])}</a>`:'';
const srcs=a=>a&&a.length?`<div class="small src">Sources: ${a.map(u=>link(u)).join(' · ')}</div>`:'';
function stars(x){const r=Math.round(x*2)/2,f=Math.floor(r),h=r-f?1:0;return '★'.repeat(f)+(h?'½':'')+'<span style="color:#ddd">'+'★'.repeat(5-f-h)+'</span>'}
const gtxt=g=>g&&g.rating?`<span class="meta">★ ${g.rating.toFixed(1)} (${g.count.toLocaleString()}) Google via bonaire.com</span>`:'';

// ---------- nav ----------
function nav(){const t=$('#tabs'),b=$('#bottombar');t.innerHTML=b.innerHTML='';
 TABS.forEach(([id,i,l])=>{t.insertAdjacentHTML('beforeend',`<a href="#${id}" data-t="${id}">${l}</a>`);b.insertAdjacentHTML('beforeend',`<a href="#${id}" data-t="${id}"><span class="i">${i}</span>${l}</a>`)})}
function show(){let id=(location.hash||'#home').slice(1).split('/')[0];if(!TABS.some(t=>t[0]===id))id='home';
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+id));
 document.querySelectorAll('[data-t]').forEach(a=>a.classList.toggle('on',a.dataset.t===id));
 if(id==='map'){const f=$('#mapframe');if(!f.src)f.src='map.html';else{try{f.contentWindow.map&&f.contentWindow.map.invalidateSize()}catch(e){}}}
 document.title=(id==='home'?'':TABS.find(t=>t[0]===id)[2]+' · ')+'Our Bonaire Trip'}
function showOnMap(name){location.hash='#map';const f=$('#mapframe');
 const go=()=>{const w=f.contentWindow;if(w&&w.focusSite){w.map.invalidateSize();w.focusSite(name)}else{w.__pending=name}};
 if(!f.src){f.src='map.html';f.addEventListener('load',()=>{f.contentWindow.__pending=name;go()},{once:true})}else setTimeout(go,60)}
window.showOnMap=showOnMap;

// ---------- Home ----------
function home(){const t=D.trip,h=t.hotel;const st=JSON.parse(localStorage.getItem('bonaire-checklist')||'{}');
 const done=t.checklist.filter(c=>st[c.id]).length;
 $('#v-home').innerHTML=`<div class="wrap">
 <div class="hero"><h1>🌊 ${esc(t.title)}</h1><p>${esc(t.subtitle)} · Nov 9–16, 2026</p></div>
 <h2>🏠 Our hotel</h2>
 <div class="card"><h3>${esc(h.name)}</h3><div class="meta">${esc(h.addr)}</div><ul class="clean">${h.points.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>
 <a class="btn" href="${dir(h.lat,h.lon)}" target="_blank" rel="noopener">📍 Directions</a><a class="btn alt" href="${esc(h.url)}" target="_blank" rel="noopener">Website</a><button class="btn alt" onclick="showOnMap(${esc(JSON.stringify(h.name))})">Show on map</button>${srcs(h.src)}</div>
 <h2>🧳 Trip details</h2>
 <div class="card"><div class="kv">${t.tbd.map(x=>`<b>${esc(x.k)}</b><span>${x.known?'✅ '+esc(x.v):'<span class="tbd">TBD</span> '+esc(x.v.replace(/^TBD ?/,''))}</span>`).join('')}</div>
 <div class="small" style="margin-top:8px">This site is public, so confirmation numbers and personal details stay off it.</div></div>
 <h2>✅ Before you go <span class="meta" id="ckcount">(${done}/${t.checklist.length})</span></h2>
 <div class="card"><div class="progress"><div id="ckbar" style="width:${100*done/t.checklist.length}%"></div></div>
 ${t.checklist.map(c=>`<label class="check${st[c.id]?' done':''}"><input type="checkbox" data-ck="${c.id}"${st[c.id]?' checked':''}><div><div class="t">${esc(c.t)}</div><div class="n">${esc(c.note||'')} ${c.url?link(c.url,'Official site ↗'):''}</div></div></label>`).join('')}
 <div class="small">Checkmarks are saved on this device only.</div></div>
 <h2>Jump to</h2><div class="chips">${TABS.slice(1).map(([id,i,l])=>`<a class="chip" href="#${id}" style="text-decoration:none">${i} ${l}</a>`).join('')}</div>
 ${foot()}</div>`;
 document.querySelectorAll('[data-ck]').forEach(i=>i.onchange=()=>{const s=JSON.parse(localStorage.getItem('bonaire-checklist')||'{}');s[i.dataset.ck]=i.checked;localStorage.setItem('bonaire-checklist',JSON.stringify(s));i.closest('.check').classList.toggle('done',i.checked);
  const d=t.checklist.filter(c=>s[c.id]).length;$('#ckcount').textContent=`(${d}/${t.checklist.length})`;$('#ckbar').style.width=(100*d/t.checklist.length)+'%'})}
const foot=()=>`<div class="foot">Last updated ${esc(D.trip.updated)} · Ratings and prices change, so check before booking.<br>Map data © OpenStreetMap contributors</div>`;

// ---------- Diving ----------
let diveF='all';
function diving(){const dv=D.diving,S=D.sites.filter(s=>['shore','advanced','boat','restricted'].includes(s.cat));
 const list=S.filter(s=>diveF==='all'||s.cat===diveF);
 $('#v-diving').innerHTML=`<div class="wrap"><h1>🤿 Diving</h1>
 <div class="card" style="border-left:5px solid var(--coral)"><h3>⚠️ Day 1: mandatory orientation dive</h3>${esc(dv.orientation)} ${link(dv.orientation_src,'source')}</div>
 <h2>Dive sites (${S.length})</h2>
 <div class="chips">${[['all','All']].concat(['shore','advanced','boat','restricted'].map(k=>[k,CATS[k][0]])).map(([k,l])=>`<button class="chip${diveF===k?' on':''}" data-df="${k}">${k!=='all'?`<span class="dot" style="background:${CATS[k][1]}"></span>`:''}${esc(l)}</button>`).join('')}</div>
 <div class="grid">${list.map(s=>`<div class="card"><h3><span class="dot" style="background:${CATS[s.cat][1]}"></span>${esc(s.name)}</h3><div class="meta">${esc(CATS[s.cat][0])}${s.depth?' · Depth '+esc(s.depth):''}${s.skill?' · '+esc(s.skill):''}</div><div style="font-size:14px;margin-top:4px">${esc(s.note)}</div>
  <button class="btn sm" onclick="showOnMap(${esc(JSON.stringify(s.name))})">Show on map</button><a class="btn sm alt" href="${dir(s.lat,s.lon)}" target="_blank" rel="noopener">Directions</a></div>`).join('')}</div>
 <div class="card small">${esc(dv.week)}</div>
 <h2>🌡️ Conditions Oct–Dec</h2><div class="card"><div class="kv">${dv.conditions.map(c=>`<b>${esc(c.k)}</b><span>${esc(c.v)}</span>`).join('')}</div>${srcs(dv.conditions_src)}</div>
 <h2>🏪 Operators & prices</h2><div class="grid">${dv.operators.map(o=>`<div class="card"><h3>${esc(o.name)}</h3>${gtxt(o.g)}<ul class="clean">${o.prices.map(p=>`<li class="price">${esc(p)}</li>`).join('')}</ul><div style="font-size:14px">${esc(o.note)}</div>${srcs([o.url])}</div>`).join('')}</div>
 <h2>🎒 What to bring</h2><div class="card"><ul class="clean">${dv.bring.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
 <h2>📜 Marine park rules</h2><div class="card"><ul class="clean">${dv.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${srcs(dv.rules_src)}</div>
 <h2>🚫 Things to avoid</h2><div class="card"><ul class="clean">${dv.avoid.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${srcs(dv.avoid_src)}</div>
 ${foot()}</div>`;
 document.querySelectorAll('[data-df]').forEach(b=>b.onclick=()=>{diveF=b.dataset.df;const y=$('#v-diving').scrollTop;diving();$('#v-diving').scrollTop=y})}

// ---------- Food ----------
const FF={min:0,unrated:true,v:{'Must try':1,'Good':1,'OK':1,'Skip':1},t:{food_cheap:1,food_mid:1,food_splurge:1}};
function food(){const all=D.sites.filter(s=>s.cat.startsWith('food'));
 const pass=s=>{const r=s.ratings;if(!FF.t[s.cat])return false;if(!r||!r.verdict)return FF.unrated;return r.score>=FF.min&&FF.v[r.verdict]};
 const list=all.filter(pass).sort((a,b)=>((b.ratings||{}).score||0)-((a.ratings||{}).score||0)||((b.ratings||{}).total||0)-((a.ratings||{}).total||0));
 const gro=D.sites.filter(s=>s.cat==='groceries').sort((a,b)=>((b.ratings||{}).score||0)-((a.ratings||{}).score||0));
 const y=$('#v-food').scrollTop;
 $('#v-food').innerHTML=`<div class="wrap"><h1>🍴 Food, ranked</h1><div class="meta">Combined score = review-count-weighted average of Google (via bonaire.com) and TripAdvisor. Fetched ${esc((all[0].ratings||{}).fetched||'')}.</div>
 <div class="filters"><div class="chips"><b style="align-self:center;font-size:13px">Min ★</b>${[['Any',0],['3+',3],['3.5+',3.5],['4+',4],['4.5+',4.5]].map(([l,v])=>`<button class="chip${FF.min===v?' on':''}" data-min="${v}">${l}</button>`).join('')}
 <label class="chip" style="display:flex;gap:4px;align-items:center"><input type="checkbox" id="unr"${FF.unrated?' checked':''}>Include unrated</label></div>
 <div class="chips">${Object.keys(FF.t).map(k=>`<button class="chip${FF.t[k]?' on':''}" data-tier="${k}"><span class="dot" style="background:${CATS[k][1]}"></span>${CATS[k][0]}</button>`).join('')}</div>
 <div class="chips">${Object.keys(FF.v).map(v=>`<button class="chip${FF.v[v]?' on':''}" data-v="${v}" ${FF.v[v]?`style="background:${VC[v]};border-color:${VC[v]}"`:''}>${v}</button>`).join('')}</div>
 <div class="count">Showing ${list.length} of ${all.length} food places</div></div>
 ${list.map((s,i)=>{const r=s.ratings;return `<div class="card rank"><div class="num">${i+1}</div><div style="flex:1;min-width:0">
  <h3>${esc(s.name)}</h3><div class="meta"><span class="dot" style="background:${CATS[s.cat][1]}"></span>${CATS[s.cat][0]}${s.addr?' · '+esc(s.addr):''}</div>
  ${r?`<div><span class="stars">${stars(r.score)}</span><span class="score">${r.score.toFixed(1)}</span> <span class="meta">${r.total.toLocaleString()} reviews</span></div>
  <div><span class="vb" style="background:${VC[r.verdict]}">${r.verdict}</span> <span class="meta">${esc(r.why)}</span></div>
  <div style="font-size:14px;margin-top:5px">${esc(r.summary)}</div>${r.flag?`<div class="flag">⚠ ${esc(r.flag)}</div>`:''}
  <details><summary>Sources & notes</summary>${r.sources.map(x=>`<div class="small">${esc(x.src)}: ${x.rating.toFixed(1)} (${x.count.toLocaleString()})${x.rank?' · '+esc(x.rank):''} · ${link(x.url,'listing')}</div>`).join('')}<div style="font-size:14px;margin-top:4px">${esc(s.note)}</div></details>`:'<div class="meta">No ratings found</div>'}
  <button class="btn sm" onclick="showOnMap(${esc(JSON.stringify(s.name))})">Show on map</button><a class="btn sm alt" href="${dir(s.lat,s.lon)}" target="_blank" rel="noopener">Directions</a>${s.url?`<a class="btn sm alt" href="${esc(s.url)}" target="_blank" rel="noopener">Website</a>`:''}
 </div></div>`}).join('')||'<div class="card">No places match these filters.</div>'}
 <h2>🛒 Groceries</h2><div class="grid">${gro.map(s=>{const r=s.ratings;return `<div class="card"><h3>${esc(s.name)}</h3>${r?`<div class="meta">★ ${r.score.toFixed(1)} (${r.total.toLocaleString()}) ${link(r.sources[0].url,'Google via bonaire.com')}</div>`:''}<div style="font-size:14px;margin-top:4px">${esc(s.note)}</div><button class="btn sm" onclick="showOnMap(${esc(JSON.stringify(s.name))})">Show on map</button><a class="btn sm alt" href="${dir(s.lat,s.lon)}" target="_blank" rel="noopener">Directions</a></div>`}).join('')}</div>
 ${foot()}</div>`;
 $('#v-food').scrollTop=y;
 document.querySelectorAll('[data-min]').forEach(b=>b.onclick=()=>{FF.min=+b.dataset.min;food()});
 $('#unr').onchange=e=>{FF.unrated=e.target.checked;food()};
 document.querySelectorAll('[data-tier]').forEach(b=>b.onclick=()=>{FF.t[b.dataset.tier]=!FF.t[b.dataset.tier];food()});
 document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{FF.v[b.dataset.v]=!FF.v[b.dataset.v];food()})}

// ---------- Deals ----------
function item(a){return `<div class="card"><h3>${esc(a.name)}</h3><div class="price">${esc(a.price)}</div>${gtxt(a.g)}${a.note?`<div style="font-size:14px;margin-top:4px">${esc(a.note)}</div>`:''}${a.url?`<a class="btn sm alt" href="${esc(a.url)}" target="_blank" rel="noopener">Details ↗</a>`:''}</div>`}
function deals(){const d=D.deals;const groups={};d.activities.forEach(a=>(groups[a.cat]=groups[a.cat]||[]).push(a));
 $('#v-deals').innerHTML=`<div class="wrap"><h1>🎟️ Deals & Activities</h1><div class="meta">Prices checked ${esc(d.fetched)} from the official sites unless noted. Nothing has been booked.</div>
 <h2>⭐ Best deals</h2><div class="grid">${d.deals.map(item).join('')}</div>
 <h2>💆 Spas & massage</h2><div class="grid">${d.spas.map(item).join('')}</div>
 <h2>🚤 Activities</h2>${Object.entries(groups).map(([k,v])=>`<h3 style="margin:14px 0 4px;color:var(--mut)">${esc(k)}</h3><div class="grid">${v.map(item).join('')}</div>`).join('')}
 <h2>💰 How to save</h2><div class="card"><ul class="clean">${d.save.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
 <h2>⏳ Expired / unverified</h2><div class="card"><ul class="clean">${d.unverified.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
 <h2>🔗 Links</h2><div class="card">${d.links.map(l=>`<div>${link(l.u,l.t)}</div>`).join('')}</div>
 ${foot()}</div>`}

// ---------- Info ----------
function info(){const telify=s=>esc(s).replace(/(\+?\d[\d\s-]{6,}\d)/g,m=>`<a class="tel" href="tel:${m.replace(/[^\d+]/g,'')}">${m}</a>`).replace(/(Police|Ambulance): (\d{3})/,(m,a,b)=>`${a}: <a class="tel" href="tel:${b}">${b}</a>`);
 $('#v-info').innerHTML=`<div class="wrap"><h1>ℹ️ Info</h1>
 <div class="chips">${D.info.sections.map(s=>`<a class="chip" style="text-decoration:none" href="#info" onclick="document.getElementById('i-${s.id}').scrollIntoView({behavior:'smooth'});return false">${esc(s.h)}</a>`).join('')}</div>
 ${D.info.sections.map(s=>`<h2 id="i-${s.id}">${esc(s.h)}</h2><div class="card"${s.id==='emergency'?' style="border-left:5px solid #d50000"':''}><ul class="clean">${s.items.map(x=>`<li>${s.tel?telify(x):esc(x)}</li>`).join('')}</ul>${s.note?`<div class="small">${esc(s.note)}</div>`:''}${srcs(s.src)}</div>`).join('')}
 ${foot()}</div>`}

// ---------- Rentals ----------
function rentals(){const r=D.rentals;
 $('#v-rentals').innerHTML=`<div class="wrap"><h1>📷 Rentals</h1><div class="meta">Checked ${esc(r.checked)}. <b>${esc(r.status)}</b> — all items below are options only.</div>
 <div class="chips">${r.sections.map(s=>`<a class="chip" style="text-decoration:none" href="#rentals" onclick="document.getElementById('r-${s.id}').scrollIntoView({behavior:'smooth'});return false">${esc(s.h)}</a>`).join('')}</div>
 ${r.sections.map(s=>`<h2 id="r-${s.id}">${esc(s.h)}</h2><div class="grid">${s.items.map(a=>`<div class="card"><h3>${esc(a.name)} <span class="tag">Not booked</span></h3><div class="price">${esc(a.price)}</div>${a.note?`<div style="font-size:14px;margin-top:4px">${esc(a.note)}</div>`:''}${a.flag?`<div class="small" style="color:#e65100;margin-top:4px">⚠️ ${esc(a.flag)}</div>`:''}${a.url?`<a class="btn sm alt" href="${esc(a.url)}" target="_blank" rel="noopener">Details ↗</a>`:''}</div>`).join('')}</div>`).join('')}
 ${foot()}</div>`}

// ---------- Itinerary ----------
const DIVE={shore:['🤿 Shore dives','#1e88e5'],boat:['🚤 Boat dives','#8e24aa'],none:['🚫 No diving','#757575']};
function itinerary(){const it=D.itinerary;
 $('#v-itinerary').innerHTML=`<div class="wrap"><h1>📅 Itinerary</h1><div class="card" style="border-left:5px solid var(--coral)"><b>${esc(it.label)}</b><div class="small">${esc(it.note)} No diving within 24 h of the Mon Nov 16 flight: last dive Sat Nov 14, Sun is a land day.</div></div>
 <div class="week">${it.days.map((d,i)=>`<a href="#itinerary" onclick="document.getElementById('d-${i}').scrollIntoView({behavior:'smooth'});return false" style="border-top:4px solid ${DIVE[d.dive][1]}"><b>${esc(d.d)}</b><span>${esc(d.date.split(' ')[1])}</span></a>`).join('')}</div>
 ${it.days.map((d,i)=>`<div class="card" id="d-${i}" style="border-left:5px solid ${DIVE[d.dive][1]}"><div class="meta">Day ${i+1} · ${esc(d.d)} ${esc(d.date)} · ${DIVE[d.dive][0]}</div><h3>${esc(d.title)}</h3><ul class="clean">${d.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${d.dinner?`<div style="font-size:14px">🍽️ <b>Dinner idea:</b> ${esc(d.dinner)}</div>`:''}</div>`).join('')}
 ${foot()}</div>`}

// ---------- boot ----------
async function boot(){nav();
 const names=['trip','sites','diving','deals','info','rentals','itinerary'];
 const r=await Promise.all(names.map(n=>fetch(`data/${n}.json`,{cache:'no-cache'}).then(x=>x.json())));
 names.forEach((n,i)=>D[n]=r[i]);
 home();itinerary();diving();food();deals();rentals();info();show();
 window.addEventListener('hashchange',show)}
boot().catch(e=>{document.getElementById('v-home').classList.add('on');document.getElementById('v-home').innerHTML='<div class="card">Could not load trip data. Check your connection and reload.</div>';console.error(e)});
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
