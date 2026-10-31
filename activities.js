'use strict';
// Activities tab. Built with DOM APIs + textContent only (no innerHTML of data).
(function(){
const KEY='bonaire-activity-picks';
let catF='all',onlyPicks=false;
const picks=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}};
const savePicks=p=>localStorage.setItem(KEY,JSON.stringify(p));
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=String(text);return e}
function safeUrl(u){try{const x=new URL(u,location.href);return(x.protocol==='https:'||x.protocol==='http:')?x.href:null}catch(e){return null}}
function safeImg(u){return /^img\/activities\/[a-z0-9-]+\.jpg$/.test(u)?u:null}
function ext(href,text,cls){const a=el('a',cls,text);const u=safeUrl(href);if(u){a.href=u;a.target='_blank';a.rel='noopener noreferrer'}return a}
function row(k,v){const d=el('div','act-row');d.append(el('b',null,k),el('span',null,v));return d}
function picksText(list){const p=picks();const sel=list.filter(a=>p.includes(a.id));
 if(!sel.length)return '';
 return 'Janet, here are our Bonaire activity picks. Please check availability and prices (do not book until we OK it):\n'+sel.map((a,i)=>`${i+1}. ${a.name} (${a.operator}) - ${a.price} - ${a.book}`).join('\n')}
async function copy(t){try{await navigator.clipboard.writeText(t);return true}catch(e){const ta=el('textarea');ta.value=t;document.body.append(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();return ok}}
window.activities=function(){
 const d=window.__D.activities,root=document.getElementById('v-activities');const y=root.scrollTop;
 const A=(d&&Array.isArray(d.activities)?d.activities:[]).slice(0,60).filter(a=>a&&typeof a.name==='string'&&typeof a.id==='string');
 const cats=[...new Set(A.map(a=>String(a.cat)))];const p=picks();
 root.replaceChildren();const w=el('div','wrap');root.append(w);
 w.append(el('h1',null,'🎯 Activities'));
 w.append(el('div','meta',`${A.length} things to do beyond diving. Checked ${d.checked}. ${d.disclaimer}`));
 const f=el('div','filters');w.append(f);
 const chips=el('div','chips');f.append(chips);
 [['all','All']].concat(cats.map(c=>[c,c])).forEach(([k,l])=>{const b=el('button','chip'+(catF===k?' on':''),l);b.type='button';b.addEventListener('click',()=>{catF=k;activities()});chips.append(b)});
 const pb=el('button','chip'+(onlyPicks?' on':''),`♥ Our picks (${p.length})`);pb.type='button';pb.addEventListener('click',()=>{onlyPicks=!onlyPicks;activities()});chips.append(pb);
 const bar=el('div','act-bar');f.append(bar);
 const cb=el('button','btn','📋 Send picks to Janet to book');cb.type='button';
 const msg=el('span','small');
 cb.addEventListener('click',async()=>{const t=picksText(A);if(!t){msg.textContent='Tap ♡ on a few activities first.';return}
  msg.textContent=(await copy(t))?'Copied! Paste it in your chat with Janet.':'Could not copy. Long-press to select the list below.';
  let pre=bar.querySelector('pre');if(!pre){pre=el('pre','act-pre');bar.append(pre)}pre.textContent=t});
 bar.append(cb,msg);
 const list=A.filter(a=>(catF==='all'||a.cat===catF)&&(!onlyPicks||p.includes(a.id)));
 f.append(el('div','count',`Showing ${list.length} of ${A.length}`));
 const g=el('div','grid');w.append(g);
 list.forEach(a=>{const c=el('div','card act');
  const ph=a.photo||{};const src=safeImg(ph.src);
  if(src){const fig=el('figure','act-fig');const im=el('img');im.src=src;im.alt=String(ph.alt||a.name);im.loading='lazy';im.decoding='async';im.width=800;im.height=533;
   const h=el('button','act-heart'+(p.includes(a.id)?' on':''),p.includes(a.id)?'♥':'♡');h.type='button';h.setAttribute('aria-label','Want this: '+a.name);h.setAttribute('aria-pressed',p.includes(a.id));
   h.addEventListener('click',()=>{let q=picks();q=q.includes(a.id)?q.filter(x=>x!==a.id):q.concat(a.id);savePicks(q);activities()});
   const cap=el('figcaption','small');if(ph.caption)cap.append(el('span',null,ph.caption+' '));cap.append(ph.credit_url?ext(ph.credit_url,ph.credit):el('span',null,ph.credit||''));
   fig.append(im,h,cap);c.append(fig)}
  c.append(el('div','act-cat',a.cat),el('h3',null,a.name),el('div','meta',a.operator),el('div','price',a.price));
  const kv=el('div','act-kv');kv.append(row('⏱',a.duration),row('📅',a.days));c.append(kv);
  c.append(el('p','act-desc',a.desc));
  const det=el('details');det.append(el('summary',null,'Good to know'));
  det.append(row('💑',a.couple),row('🤿',a.physical));
  const ps=el('div','small');ps.append(el('span',null,'Price source: '),ext(a.price_src,(safeUrl(a.price_src)||'').replace(/^https?:\/\/(www\.)?/,'').split('/')[0]));det.append(ps);
  if(a.note)det.append(el('div','flag',a.note));c.append(det);
  const btns=el('div','act-btns');btns.append(ext(a.book,'Book / details ↗','btn sm'),ext(a.site,'Website','btn sm alt'));c.append(btns);
  g.append(c)});
 if(!list.length)g.append(el('div','card',onlyPicks?'No picks yet. Tap ♡ on any photo.':'Nothing in this category.'));
 w.append(el('div','foot','Photos are freely licensed from Wikimedia Commons (credits under each). Hearts are saved on this device only. Nothing is booked.'));
 root.scrollTop=y};
})();
