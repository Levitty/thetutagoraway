// ============================================================================
// Build a self-contained interactive knowledge-graph visualization (HTML) —
// MARBLE-inspired: hero panel with subject counts, and a detail panel that
// traces every prerequisite of a skill all the way back.
//
//   node engine/scripts/build_graph_viz.mjs math
//   node engine/scripts/build_graph_viz.mjs cambridge
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');
const subject = process.argv[2] || 'math';

const graph = JSON.parse(readFileSync(resolve(root, `engine/data/${subject}_graph.json`), 'utf8'));
const gradeLabel = subject === 'cambridge' ? 'Stage' : subject === 'math' ? 'Grade' : 'Level';
const nameCap = graph.subject.charAt(0).toUpperCase() + graph.subject.slice(1);
const links = graph.skills.reduce((n, s) => n + s.prerequisites.length, 0);
const tagline = subject === 'cambridge'
  ? 'The Cambridge maths map,<br>Primary to IGCSE.'
  : 'Everything a student<br>learns in maths.';

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${nameCap} — HOREB Knowledge Map</title>
<style>
  :root{ --bg:#080b14; --panel:rgba(20,27,45,.72); --line:rgba(148,163,184,.18); --text:#e7ecf5; --muted:#8b97ad; }
  *{box-sizing:border-box;} html,body{margin:0;height:100%;}
  body{background:radial-gradient(1200px 800px at 60% -10%, #10192e 0%, var(--bg) 60%); color:var(--text);
    font-family:-apple-system,'Segoe UI',Inter,sans-serif; overflow:hidden;}
  svg{position:fixed;inset:0;width:100%;height:100%;cursor:grab;} svg:active{cursor:grabbing;}
  .edge{stroke:rgba(148,163,184,.16);stroke-width:.8;fill:none;} .edge.hot{stroke:#fbbf24;stroke-width:1.6;opacity:.95;}
  .node circle.core{stroke:rgba(8,11,20,.9);stroke-width:1.2;cursor:pointer;}
  .node circle.glow{opacity:.28;pointer-events:none;}
  .node.dim{opacity:.08;} .node.hot circle.core{stroke:#fff;stroke-width:2.4;}
  .gradeband text{fill:var(--muted);font-size:12px;letter-spacing:.08em;text-transform:uppercase;}
  .gradeband line{stroke:var(--line);}

  /* Hero (left) */
  #hero{position:fixed;left:36px;top:34px;max-width:380px;z-index:4;}
  #hero .brand{font-weight:800;letter-spacing:.14em;font-size:15px;color:#fff;}
  #hero h1{font-family:Georgia,'Times New Roman',serif;font-weight:600;font-size:52px;line-height:1.02;margin:18px 0 16px;}
  #hero h1 .dot{color:#ef4444;}
  #hero p{color:var(--muted);font-size:14px;line-height:1.55;margin:0 0 10px;max-width:330px;}
  #hero p b{color:var(--text);}
  #subjects{position:fixed;left:36px;bottom:30px;background:var(--panel);backdrop-filter:blur(12px);
    border:1px solid var(--line);border-radius:14px;padding:12px 14px;z-index:4;min-width:230px;}
  #subjects .h{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
  .srow{display:flex;align-items:center;gap:9px;font-size:13px;padding:3px 0;cursor:pointer;user-select:none;}
  .srow.off{opacity:.35;} .srow .dot{width:9px;height:9px;border-radius:50%;} .srow .n{margin-left:auto;color:var(--muted);}

  /* Detail (right) */
  #detail{position:fixed;right:28px;top:28px;width:330px;background:var(--panel);backdrop-filter:blur(14px);
    border:1px solid var(--line);border-radius:16px;padding:18px 18px 20px;z-index:5;display:none;}
  #detail .kicker{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:7px;}
  #detail .kicker .dot{width:8px;height:8px;border-radius:50%;}
  #detail h2{font-family:Georgia,serif;font-weight:600;font-size:23px;line-height:1.15;margin:10px 0 4px;}
  #detail .big{font-size:46px;font-weight:800;line-height:1;margin:16px 0 2px;}
  #detail .big span{font-size:14px;font-weight:500;color:var(--muted);margin-left:6px;}
  #detail .sub{color:var(--muted);font-size:12.5px;line-height:1.5;margin-bottom:14px;}
  #detail .sec{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);margin:14px 0 6px;}
  #detail .item{display:flex;align-items:center;gap:9px;padding:6px 8px;border-radius:9px;font-size:13.5px;cursor:pointer;}
  #detail .item:hover{background:rgba(148,163,184,.1);} #detail .item .g{margin-left:auto;color:var(--muted);font-size:12px;}
  #detail .close{position:absolute;right:14px;top:12px;color:var(--muted);cursor:pointer;font-size:16px;}
  #search{position:fixed;left:50%;transform:translateX(-50%);top:26px;z-index:4;background:var(--panel);backdrop-filter:blur(10px);
    border:1px solid var(--line);border-radius:999px;color:var(--text);padding:8px 16px;font-size:13px;width:240px;text-align:center;}
  .hint{position:fixed;right:24px;bottom:20px;color:var(--muted);font-size:12px;z-index:4;}
  @media print{#hero,#search,.hint{display:none;} body{overflow:visible;}}
</style></head>
<body>
<svg id="svg"><g id="view"></g></svg>

<div id="hero">
  <div class="brand">◆ HOREB</div>
  <h1>${tagline}<span class="dot">.</span></h1>
  <p>The adaptive learning map behind Tutagora's ${nameCap} tutor.</p>
  <p><b>${graph.skill_count}</b> skills and <b>${links}</b> prerequisite links — every link says what must come first. <b>Tap any dot</b> to trace everything a learner must master before it.</p>
</div>

<div id="subjects"><div class="h">Strands · click to toggle</div><div id="srows"></div></div>

<div id="detail">
  <span class="close" onclick="closeDetail()">✕</span>
  <div class="kicker" id="d-kicker"></div>
  <h2 id="d-name"></h2>
  <div class="big" id="d-count"></div>
  <div class="sub">Everything a learner must master before this one, traced all the way back.</div>
  <div id="d-builds"></div>
  <div id="d-all"></div>
  <div id="d-unlocks"></div>
</div>

<input id="search" placeholder="Search a skill…" />
<div class="hint">Scroll to zoom · Drag to pan · Tap a dot</div>

<script>
const DATA=${JSON.stringify({ skills: graph.skills, strands: graph.strands, grades: graph.grades })};
const GLABEL=${JSON.stringify(gradeLabel)};
const PALETTE=['#6366f1','#22c55e','#ec4899','#f59e0b','#14b8a6','#a855f7','#ef4444','#eab308','#38bdf8'];
const col={}; DATA.strands.forEach((s,i)=>col[s]=PALETTE[i%PALETTE.length]);
const skills=DATA.skills, byId={}; skills.forEach(s=>byId[s.id]=s);
const grades=[...DATA.grades].sort((a,b)=>a-b);
const deps={}; skills.forEach(s=>deps[s.id]=[]); skills.forEach(s=>s.prerequisites.forEach(p=>deps[p]&&deps[p].push(s.id)));

// layout: grade bands (y), spread by strand+name (x)
const BANDH=160,TOP=60,W=Math.max(1500,skills.length*11),PAD=70;
const gy={}; grades.forEach((g,i)=>gy[g]=TOP+i*BANDH);
const si={}; DATA.strands.forEach((s,i)=>si[s]=i);
grades.forEach(g=>{const row=skills.filter(s=>s.grade===g).sort((a,b)=>(si[a.strand]-si[b.strand])||a.name.localeCompare(b.name));
  const n=row.length; row.forEach((s,i)=>{s._x=PAD+(n<=1?(W-2*PAD)/2:(i/(n-1))*(W-2*PAD)); s._y=gy[g]+(i%3-1)*20;});});
const active=new Set(DATA.strands);

const NS='http://www.w3.org/2000/svg', view=document.getElementById('view');
const el=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e;};

grades.forEach(g=>{const b=el('g',{class:'gradeband'});
  b.appendChild(el('line',{x1:0,y1:gy[g]-BANDH/2+18,x2:W,y2:gy[g]-BANDH/2+18}));
  const t=el('text',{x:12,y:gy[g]-BANDH/2+42}); t.textContent=GLABEL+' '+g; b.appendChild(t); view.appendChild(b);});

const edgeEls=[];
skills.forEach(s=>s.prerequisites.forEach(p=>{const a=byId[p];if(!a)return;
  const path=el('path',{class:'edge','data-a':p,'data-b':s.id});
  path.setAttribute('d','M '+a._x+' '+a._y+' Q '+((a._x+s._x)/2)+' '+((a._y+s._y)/2)+' '+s._x+' '+s._y);
  view.appendChild(path); edgeEls.push(path);}));

const nodeEls={};
skills.forEach(s=>{const g=el('g',{class:'node','data-id':s.id});
  const r=s.critical?8:5+Math.min(3,(s.weight-1)/2);
  g.appendChild(el('circle',{class:'glow',cx:s._x,cy:s._y,r:r*2.6,fill:col[s.strand]}));
  g.appendChild(el('circle',{class:'core',cx:s._x,cy:s._y,r,fill:col[s.strand]}));
  view.appendChild(g); nodeEls[s.id]=g;
  g.addEventListener('mouseenter',()=>{if(!locked)highlight(s.id);});
  g.addEventListener('mouseleave',()=>{if(!locked)clear();});
  g.addEventListener('click',e=>{e.stopPropagation();locked=s.id;highlight(s.id);openDetail(s);});});

let locked=null;
const anc=(id,set)=>{(byId[id].prerequisites||[]).forEach(p=>{if(byId[p]&&!set.has(p)){set.add(p);anc(p,set);}});};
const desc=(id,set)=>{(deps[id]||[]).forEach(d=>{if(!set.has(d)){set.add(d);desc(d,set);}});};
function highlight(id){const set=new Set([id]);anc(id,set);desc(id,set);
  skills.forEach(s=>{const n=nodeEls[s.id];n.classList.toggle('dim',!set.has(s.id));n.classList.toggle('hot',s.id===id);});
  edgeEls.forEach(e=>e.classList.toggle('hot',set.has(e.getAttribute('data-a'))&&set.has(e.getAttribute('data-b'))));}
function clear(){skills.forEach(s=>nodeEls[s.id].classList.remove('dim','hot'));edgeEls.forEach(e=>e.classList.remove('hot'));}

const D=document.getElementById('detail');
function openDetail(s){
  const set=new Set(); anc(s.id,set);
  document.getElementById('d-kicker').innerHTML='<span class="dot" style="background:'+col[s.strand]+'"></span>'+s.strand+' · '+GLABEL+' '+s.grade+(s.critical?' · ★':'');
  document.getElementById('d-name').textContent=s.name;
  document.getElementById('d-count').innerHTML=set.size+'<span>prerequisites in total</span>';
  const list=(ids,empty)=>ids.length? ids.map(id=>{const t=byId[id];return '<div class="item" onclick="jump(\\''+id+'\\')"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:'+col[t.strand]+'"></span>'+t.name+'<span class="g">'+GLABEL.toLowerCase()+' '+t.grade+'</span></div>';}).join('') : '<div class="sub" style="margin:0">'+empty+'</div>';
  document.getElementById('d-builds').innerHTML='<div class="sec">Builds directly on · '+s.prerequisites.length+'</div>'+list(s.prerequisites,'Nothing — this is a starting point.');
  // Full traced-back list, named, ordered by grade (scrollable).
  const all=[...set].sort((a,b)=>byId[a].grade-byId[b].grade);
  document.getElementById('d-all').innerHTML = all.length
    ? '<div class="sec">All prerequisites · '+all.length+'</div><div style="max-height:180px;overflow:auto;margin:0 -4px">'+list(all,'')+'</div>'
    : '';
  document.getElementById('d-unlocks').innerHTML='<div class="sec">Unlocks next · '+deps[s.id].length+'</div>'+list(deps[s.id],'Nothing yet — a frontier skill.');
  D.style.display='block';
}
function jump(id){locked=id;highlight(id);openDetail(byId[id]);}
function closeDetail(){D.style.display='none';locked=null;clear();}

const rows=document.getElementById('srows');
DATA.strands.forEach(s=>{const c=skills.filter(x=>x.strand===s).length;
  const r=document.createElement('div');r.className='srow';
  r.innerHTML='<span class="dot" style="background:'+col[s]+'"></span>'+s+'<span class="n">'+c+'</span>';
  r.onclick=()=>{r.classList.toggle('off');active.has(s)?active.delete(s):active.add(s);
    skills.forEach(x=>nodeEls[x.id].style.display=active.has(x.strand)?'':'none');
    edgeEls.forEach(e=>{const a=byId[e.getAttribute('data-a')],b=byId[e.getAttribute('data-b')];e.style.display=(a&&b&&active.has(a.strand)&&active.has(b.strand))?'':'none';});};
  rows.appendChild(r);});

document.getElementById('search').addEventListener('input',e=>{const q=e.target.value.toLowerCase();
  if(!q){clear();return;} skills.forEach(s=>{const m=s.name.toLowerCase().includes(q);nodeEls[s.id].classList.toggle('hot',m);nodeEls[s.id].classList.toggle('dim',!m);});});

const svg=document.getElementById('svg');let scale=.62,tx=340,ty=30,drag=false,sx,sy;
const apply=()=>view.setAttribute('transform','translate('+tx+' '+ty+') scale('+scale+')');
svg.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(.12,Math.min(3,scale*(e.deltaY<0?1.1:.9)));apply();},{passive:false});
svg.addEventListener('mousedown',e=>{if(e.target.closest('.node'))return;drag=true;sx=e.clientX-tx;sy=e.clientY-ty;closeDetail();});
window.addEventListener('mousemove',e=>{if(drag){tx=e.clientX-sx;ty=e.clientY-sy;apply();}});
window.addEventListener('mouseup',()=>drag=false); apply();
</script></body></html>`;

const out = resolve(root, `${subject}-knowledge-graph.html`);
writeFileSync(out, html);
console.log(`Wrote ${graph.skill_count} skills, ${links} links -> ${out.replace(root + '/', '')}`);
