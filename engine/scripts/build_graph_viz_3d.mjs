// ============================================================================
// 3D spinning knowledge-graph (MARBLE-style). Uses 3d-force-graph (three.js)
// from a CDN, so this file needs an internet connection to render.
//   node engine/scripts/build_graph_viz_3d.mjs math
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..');
const subject = process.argv[2] || 'math';
const graph = JSON.parse(readFileSync(resolve(root, `engine/data/${subject}_graph.json`), 'utf8'));
const gradeLabel = subject === 'cambridge' ? 'Stage' : subject === 'sat' ? 'Band' : subject === 'math' ? 'Grade' : 'Level';
const nameCap = graph.subject.charAt(0).toUpperCase() + graph.subject.slice(1);
const links = graph.skills.reduce((n, s) => n + s.prerequisites.length, 0);

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${nameCap} — HOREB 3D Map</title>
<style>
  :root{--panel:rgba(20,27,45,.72);--line:rgba(148,163,184,.18);--text:#e7ecf5;--muted:#8b97ad;}
  html,body{margin:0;height:100%;background:#05070e;color:var(--text);font-family:-apple-system,'Segoe UI',Inter,sans-serif;overflow:hidden;}
  #graph{position:fixed;inset:0;}
  #hero{position:fixed;left:36px;top:34px;max-width:360px;z-index:4;pointer-events:none;}
  #hero .brand{font-weight:800;letter-spacing:.14em;font-size:15px;}
  #hero h1{font-family:Georgia,serif;font-weight:600;font-size:46px;line-height:1.03;margin:16px 0 14px;}
  #hero h1 .dot{color:#ef4444;} #hero p{color:var(--muted);font-size:13.5px;line-height:1.5;max-width:320px;}
  #hero p b{color:var(--text);}
  #subjects{position:fixed;left:36px;bottom:30px;background:var(--panel);backdrop-filter:blur(12px);border:1px solid var(--line);border-radius:14px;padding:12px 14px;z-index:4;min-width:220px;}
  #subjects .h{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px;}
  .srow{display:flex;align-items:center;gap:9px;font-size:13px;padding:3px 0;}
  .srow .dot{width:9px;height:9px;border-radius:50%;} .srow .n{margin-left:auto;color:var(--muted);}
  #detail{position:fixed;right:28px;top:28px;width:320px;background:var(--panel);backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:16px;padding:18px;z-index:5;display:none;}
  #detail .kicker{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:7px;}
  #detail .kicker .dot{width:8px;height:8px;border-radius:50%;}
  #detail h2{font-family:Georgia,serif;font-size:22px;margin:10px 0 4px;}
  #detail .big{font-size:42px;font-weight:800;margin:14px 0 2px;} #detail .big span{font-size:13px;font-weight:500;color:var(--muted);margin-left:6px;}
  #detail .sec{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);margin:14px 0 6px;}
  #detail .item{display:flex;gap:9px;align-items:center;font-size:13.5px;padding:5px 0;} #detail .item .g{margin-left:auto;color:var(--muted);font-size:12px;}
  #detail .close{position:absolute;right:14px;top:12px;color:var(--muted);cursor:pointer;}
  .hint{position:fixed;right:24px;bottom:20px;color:var(--muted);font-size:12px;z-index:4;}
</style></head><body>
<div id="graph"></div>
<div id="hero"><div class="brand">◆ HOREB</div><h1>${nameCap} in three<br>dimensions<span class="dot">.</span></h1>
<p><b>${graph.skill_count}</b> skills · <b>${links}</b> prerequisite links. Drag to spin, scroll to zoom, tap a dot.</p></div>
<div id="subjects"><div class="h">Strands</div><div id="srows"></div></div>
<div id="detail"><span class="close" onclick="document.getElementById('detail').style.display='none'">✕</span>
<div class="kicker" id="dk"></div><h2 id="dn"></h2><div class="big" id="dc"></div>
<div id="db"></div><div id="du"></div></div>
<div class="hint">Drag to spin · Scroll to zoom · Tap a dot</div>
<script src="https://unpkg.com/3d-force-graph"></script>
<script>
const DATA=${JSON.stringify({ skills: graph.skills, strands: graph.strands })};
const GL=${JSON.stringify(gradeLabel)};
const PAL=['#6366f1','#22c55e','#ec4899','#f59e0b','#14b8a6','#a855f7','#ef4444','#eab308','#38bdf8'];
const col={}; DATA.strands.forEach((s,i)=>col[s]=PAL[i%PAL.length]);
const byId={}; DATA.skills.forEach(s=>byId[s.id]=s);
const deps={}; DATA.skills.forEach(s=>deps[s.id]=[]); DATA.skills.forEach(s=>s.prerequisites.forEach(p=>deps[p]&&deps[p].push(s.id)));
const nodes=DATA.skills.map(s=>({id:s.id,name:s.name,strand:s.strand,grade:s.grade,critical:s.critical,val:s.critical?6:3}));
const glinks=[]; DATA.skills.forEach(s=>s.prerequisites.forEach(p=>{if(byId[p])glinks.push({source:p,target:s.id});}));
const anc=(id,set)=>{(byId[id].prerequisites||[]).forEach(p=>{if(byId[p]&&!set.has(p)){set.add(p);anc(p,set);}});};

const G=ForceGraph3D()(document.getElementById('graph'))
  .backgroundColor('#05070e')
  .graphData({nodes,links:glinks})
  .nodeLabel(n=>n.name+' — '+GL+' '+n.grade)
  .nodeColor(n=>col[n.strand]).nodeVal('val').nodeOpacity(0.92)
  .linkColor(()=>'rgba(148,163,184,0.22)').linkWidth(0.4).linkDirectionalParticles(0)
  .onNodeClick(n=>{
    const s=byId[n.id], set=new Set(); anc(s.id,set);
    document.getElementById('dk').innerHTML='<span class="dot" style="background:'+col[s.strand]+'"></span>'+s.strand+' · '+GL+' '+s.grade;
    document.getElementById('dn').textContent=s.name;
    document.getElementById('dc').innerHTML=set.size+'<span>prerequisites in total</span>';
    const list=ids=>ids.length?ids.map(id=>{const t=byId[id];return '<div class="item"><span class="dot" style="width:8px;height:8px;border-radius:50%;background:'+col[t.strand]+'"></span>'+t.name+'<span class="g">'+GL.toLowerCase()+' '+t.grade+'</span></div>';}).join(''):'<div style="color:var(--muted);font-size:12.5px">—</div>';
    document.getElementById('db').innerHTML='<div class="sec">Builds directly on · '+s.prerequisites.length+'</div>'+list(s.prerequisites);
    document.getElementById('du').innerHTML='<div class="sec">Unlocks next · '+deps[s.id].length+'</div>'+list(deps[s.id]);
    document.getElementById('detail').style.display='block';
    G.cameraPosition({x:n.x*1.6,y:n.y*1.6,z:n.z*1.6},n,900);
  });
G.d3Force('charge').strength(-90);
const rows=document.getElementById('srows');
DATA.strands.forEach(s=>{const c=DATA.skills.filter(x=>x.strand===s).length;const r=document.createElement('div');r.className='srow';
  r.innerHTML='<span class="dot" style="background:'+col[s]+'"></span>'+s+'<span class="n">'+c+'</span>';rows.appendChild(r);});
// gentle auto-rotate until the user interacts
let spin=true; document.getElementById('graph').addEventListener('mousedown',()=>spin=false);
(function rotate(){ if(spin){ const t=Date.now()*0.00008, d=900; G.cameraPosition({x:d*Math.sin(t),z:d*Math.cos(t)}); } requestAnimationFrame(rotate); })();
</script></body></html>`;

const out = resolve(root, `${subject}-knowledge-graph-3d.html`);
writeFileSync(out, html);
console.log(`Wrote 3D graph (${graph.skill_count} skills) -> ${out.replace(root + '/', '')}`);
