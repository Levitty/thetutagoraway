// ============================================================================
// TUTAGORA INTERACTIVE VISUALS — Canvas-based math visualizations
// Renders interactive graphs, geometry, and statistics for visual skills
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ==================== COORDINATE SYSTEM HELPERS ====================
const toCanvas = (x, y, bounds, canvas) => ({
  cx: ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * canvas.width,
  cy: canvas.height - ((y - bounds.yMin) / (bounds.yMax - bounds.yMin)) * canvas.height,
});

const toMath = (cx, cy, bounds, canvas) => ({
  x: bounds.xMin + (cx / canvas.width) * (bounds.xMax - bounds.xMin),
  y: bounds.yMin + ((canvas.height - cy) / canvas.height) * (bounds.yMax - bounds.yMin),
});

const drawGrid = (ctx, bounds, w, h) => {
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 0.5;
  for (let x = Math.ceil(bounds.xMin); x <= bounds.xMax; x++) {
    const { cx } = toCanvas(x, 0, bounds, { width: w, height: h });
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
  }
  for (let y = Math.ceil(bounds.yMin); y <= bounds.yMax; y++) {
    const { cy } = toCanvas(0, y, bounds, { width: w, height: h });
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
  }
  // Axes
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  const origin = toCanvas(0, 0, bounds, { width: w, height: h });
  ctx.beginPath(); ctx.moveTo(0, origin.cy); ctx.lineTo(w, origin.cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(origin.cx, 0); ctx.lineTo(origin.cx, h); ctx.stroke();
  // Axis labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  for (let x = Math.ceil(bounds.xMin); x <= bounds.xMax; x++) {
    if (x === 0) continue;
    const { cx } = toCanvas(x, 0, bounds, { width: w, height: h });
    ctx.fillText(x, cx, origin.cy + 14);
  }
  ctx.textAlign = 'right';
  for (let y = Math.ceil(bounds.yMin); y <= bounds.yMax; y++) {
    if (y === 0) continue;
    const { cy } = toCanvas(0, y, bounds, { width: w, height: h });
    ctx.fillText(y, origin.cx - 6, cy + 4);
  }
};

// ==================== LINEAR GRAPH VISUAL ====================
const LinearGraphVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [m, setM] = useState(data.initialM ?? 1);
  const [c, setC] = useState(data.initialC ?? 0);
  const bounds = data.bounds || { xMin: -6, xMax: 6, yMin: -8, yMax: 8 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, bounds, w, h);

    // Draw the target line (dashed, faint)
    if (data.showTarget) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      const y1 = data.targetM * bounds.xMin + data.targetC;
      const y2 = data.targetM * bounds.xMax + data.targetC;
      const p1 = toCanvas(bounds.xMin, y1, bounds, { width: w, height: h });
      const p2 = toCanvas(bounds.xMax, y2, bounds, { width: w, height: h });
      ctx.moveTo(p1.cx, p1.cy); ctx.lineTo(p2.cx, p2.cy); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw user's line
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const uy1 = m * bounds.xMin + c;
    const uy2 = m * bounds.xMax + c;
    const up1 = toCanvas(bounds.xMin, uy1, bounds, { width: w, height: h });
    const up2 = toCanvas(bounds.xMax, uy2, bounds, { width: w, height: h });
    ctx.moveTo(up1.cx, up1.cy); ctx.lineTo(up2.cx, up2.cy); ctx.stroke();

    // Equation label
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 14px Inter, monospace';
    ctx.textAlign = 'left';
    const sign = c >= 0 ? '+' : '';
    ctx.fillText(`y = ${m === 1 ? '' : m === -1 ? '-' : m}x ${sign} ${c}`, 12, 24);
  }, [m, c, bounds, data]);

  useEffect(() => {
    if (onAnswer) {
      onAnswer({ m: parseFloat(m.toFixed(1)), c: parseFloat(c.toFixed(1)) });
    }
  }, [m, c]);

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={300} className="w-full rounded-xl border border-slate-700" style={{ maxWidth: 400 }} />
      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400 w-24">Gradient (m):</label>
          <input type="range" min={-5} max={5} step={0.5} value={m} onChange={e => setM(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-emerald-500" />
          <span className="text-emerald-400 font-mono w-10 text-right">{m}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400 w-24">y-intercept (c):</label>
          <input type="range" min={-6} max={6} step={0.5} value={c} onChange={e => setC(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-emerald-500" />
          <span className="text-emerald-400 font-mono w-10 text-right">{c}</span>
        </div>
      </div>
      {data.showTarget && <p className="text-xs text-slate-500 mt-2">Adjust the sliders to match the red dashed target line</p>}
    </div>
  );
};

// ==================== COORDINATE PLOTTER VISUAL ====================
const CoordinatePlotterVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [plotted, setPlotted] = useState([]);
  const bounds = data.bounds || { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, bounds, w, h);

    // Draw target points (hollow circles)
    if (data.targetPoints) {
      data.targetPoints.forEach(pt => {
        const { cx, cy } = toCanvas(pt.x, pt.y, bounds, { width: w, height: h });
        ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'; ctx.fill();
      });
    }

    // Draw plotted points
    plotted.forEach(pt => {
      const { cx, cy } = toCanvas(pt.x, pt.y, bounds, { width: w, height: h });
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`(${pt.x},${pt.y})`, cx, cy - 12);
    });
  }, [plotted, bounds, data]);

  useEffect(() => { draw(); }, [draw]);

  const handleClick = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const cx = (e.clientX - rect.left) * scaleX;
    const cy = (e.clientY - rect.top) * scaleY;
    const { x, y } = toMath(cx, cy, bounds, { width: canvas.width, height: canvas.height });
    const snappedX = Math.round(x);
    const snappedY = Math.round(y);

    // Toggle point
    const existing = plotted.findIndex(p => p.x === snappedX && p.y === snappedY);
    let newPlotted;
    if (existing >= 0) {
      newPlotted = plotted.filter((_, i) => i !== existing);
    } else {
      newPlotted = [...plotted, { x: snappedX, y: snappedY }];
    }
    setPlotted(newPlotted);
    if (onAnswer) onAnswer(newPlotted);
  };

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={360} onClick={handleClick} className="w-full rounded-xl border border-slate-700 cursor-crosshair" style={{ maxWidth: 400 }} />
      <p className="text-xs text-slate-500 mt-2">Tap/click on the grid to plot points. Tap again to remove.</p>
      {plotted.length > 0 && <p className="text-xs text-emerald-400 mt-1">Plotted: {plotted.map(p => `(${p.x}, ${p.y})`).join(', ')}</p>}
    </div>
  );
};

// ==================== QUADRATIC GRAPH VISUAL ====================
const QuadraticGraphVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [a, setA] = useState(data.initialA ?? 1);
  const [h, setH] = useState(data.initialH ?? 0);
  const [k, setK] = useState(data.initialK ?? 0);
  const bounds = data.bounds || { xMin: -8, xMax: 8, yMin: -10, yMax: 10 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, ht = canvas.height;
    ctx.clearRect(0, 0, w, ht);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, ht);
    drawGrid(ctx, bounds, w, ht);

    // Target parabola (dashed)
    if (data.showTarget) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      let first = true;
      for (let px = 0; px <= w; px += 2) {
        const { x } = toMath(px, 0, bounds, { width: w, height: ht });
        const y = data.targetA * (x - data.targetH) ** 2 + data.targetK;
        const { cy } = toCanvas(x, y, bounds, { width: w, height: ht });
        if (cy < -50 || cy > ht + 50) { first = true; continue; }
        first ? ctx.moveTo(px, cy) : ctx.lineTo(px, cy);
        first = false;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // User parabola
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let px = 0; px <= w; px += 2) {
      const { x } = toMath(px, 0, bounds, { width: w, height: ht });
      const y = a * (x - h) ** 2 + k;
      const { cy } = toCanvas(x, y, bounds, { width: w, height: ht });
      if (cy < -50 || cy > ht + 50) { first = true; continue; }
      first ? ctx.moveTo(px, cy) : ctx.lineTo(px, cy);
      first = false;
    }
    ctx.stroke();

    // Vertex marker
    const vtx = toCanvas(h, k, bounds, { width: w, height: ht });
    ctx.beginPath(); ctx.arc(vtx.cx, vtx.cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#f97316'; ctx.fill();

    // Equation label
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 13px Inter, monospace';
    ctx.textAlign = 'left';
    const hs = h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`;
    const ks = k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`;
    ctx.fillText(`y = ${a === 1 ? '' : a === -1 ? '-' : a}(x ${hs})² ${ks}`, 12, 24);
  }, [a, h, k, bounds, data]);

  useEffect(() => {
    if (onAnswer) onAnswer({ a: parseFloat(a.toFixed(1)), h: parseFloat(h.toFixed(1)), k: parseFloat(k.toFixed(1)) });
  }, [a, h, k]);

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={300} className="w-full rounded-xl border border-slate-700" style={{ maxWidth: 400 }} />
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400 w-20">Stretch (a):</label>
          <input type="range" min={-3} max={3} step={0.5} value={a} onChange={e => setA(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-emerald-500" />
          <span className="text-emerald-400 font-mono w-10 text-right">{a}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400 w-20">Vertex x (h):</label>
          <input type="range" min={-5} max={5} step={0.5} value={h} onChange={e => setH(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
          <span className="text-orange-400 font-mono w-10 text-right">{h}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-400 w-20">Vertex y (k):</label>
          <input type="range" min={-8} max={8} step={0.5} value={k} onChange={e => setK(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
          <span className="text-orange-400 font-mono w-10 text-right">{k}</span>
        </div>
      </div>
    </div>
  );
};

// ==================== ANGLE EXPLORER VISUAL ====================
const AngleExplorerVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(data.initialAngle ?? 45);
  const center = { x: 180, y: 180 };
  const radius = 130;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const rad = (angle * Math.PI) / 180;
    const endX = center.x + radius * Math.cos(-rad);
    const endY = center.y + radius * Math.sin(-rad);

    // Arc
    ctx.beginPath();
    ctx.arc(center.x, center.y, 40, 0, -rad, angle > 0);
    ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2.5; ctx.stroke();

    // Fill arc
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, 40, 0, -rad, angle > 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(249, 115, 22, 0.15)'; ctx.fill();

    // Base ray
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(center.x + radius, center.y);
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 2; ctx.stroke();

    // Angle ray
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.stroke();

    // Draggable endpoint
    ctx.beginPath(); ctx.arc(endX, endY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();

    // Angle label
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 16px Inter';
    ctx.textAlign = 'center';
    const labelRad = (-rad) / 2;
    const lx = center.x + 60 * Math.cos(labelRad);
    const ly = center.y + 60 * Math.sin(labelRad);
    ctx.fillText(`${angle}°`, lx, ly);

    // Type label
    let type = 'Acute';
    if (angle === 90) type = 'Right angle';
    else if (angle > 90 && angle < 180) type = 'Obtuse';
    else if (angle === 180) type = 'Straight';
    else if (angle > 180 && angle < 360) type = 'Reflex';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(type, center.x, 28);
  }, [angle]);

  useEffect(() => {
    if (onAnswer) onAnswer({ angle });
  }, [angle]);

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={300} className="w-full rounded-xl border border-slate-700" style={{ maxWidth: 400 }} />
      <div className="mt-3 flex items-center gap-3">
        <label className="text-sm text-slate-400 w-20">Angle:</label>
        <input type="range" min={0} max={360} step={1} value={angle} onChange={e => setAngle(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
        <span className="text-orange-400 font-mono w-14 text-right">{angle}°</span>
      </div>
    </div>
  );
};

// ==================== TRIANGLE EXPLORER VISUAL ====================
const TriangleExplorerVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [angleA, setAngleA] = useState(data.initialA ?? 60);
  const [angleB, setAngleB] = useState(data.initialB ?? 60);
  const angleC = 180 - angleA - angleB;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    if (angleC <= 0 || angleA <= 0 || angleB <= 0) {
      ctx.fillStyle = '#ef4444';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Invalid triangle (angles must sum to 180°)', w / 2, h / 2);
      return;
    }

    // Calculate triangle vertices using sine rule
    const base = 200;
    const radA = (angleA * Math.PI) / 180;
    const radB = (angleB * Math.PI) / 180;
    const radC = (angleC * Math.PI) / 180;
    const sideA = base * Math.sin(radA) / Math.sin(radC);
    const sideB = base * Math.sin(radB) / Math.sin(radC);

    const ax = (w - base) / 2, ay = h - 50;
    const bx = ax + base, by = ay;
    const cx2 = ax + sideB * Math.cos(radA);
    const cy2 = ay - sideB * Math.sin(radA);

    // Fill
    ctx.beginPath();
    ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx2, cy2); ctx.closePath();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'; ctx.fill();
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.stroke();

    // Vertices
    [[ax, ay], [bx, by], [cx2, cy2]].forEach(([vx, vy]) => {
      ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316'; ctx.fill();
    });

    // Angle labels
    ctx.font = 'bold 13px Inter';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f97316';
    ctx.fillText(`A = ${angleA}°`, ax - 10, ay + 20);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`B = ${angleB}°`, bx + 10, by + 20);
    ctx.fillStyle = '#a855f7';
    ctx.fillText(`C = ${angleC}°`, cx2, cy2 - 12);

    // Sum label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter';
    ctx.fillText(`${angleA}° + ${angleB}° + ${angleC}° = ${angleA + angleB + angleC}°`, w / 2, 24);
  }, [angleA, angleB, angleC]);

  useEffect(() => {
    if (onAnswer) onAnswer({ angleA, angleB, angleC });
  }, [angleA, angleB, angleC]);

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={300} className="w-full rounded-xl border border-slate-700" style={{ maxWidth: 400 }} />
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm text-orange-400 w-20">Angle A:</label>
          <input type="range" min={10} max={150} step={1} value={angleA} onChange={e => setAngleA(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
          <span className="text-orange-400 font-mono w-12 text-right">{angleA}°</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-blue-400 w-20">Angle B:</label>
          <input type="range" min={10} max={Math.min(150, 170 - angleA)} step={1} value={Math.min(angleB, 170 - angleA)} onChange={e => setAngleB(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-blue-500" />
          <span className="text-blue-400 font-mono w-12 text-right">{angleB}°</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-purple-400 w-20">Angle C:</label>
          <span className="flex-1 text-sm text-slate-500">auto-calculated</span>
          <span className="text-purple-400 font-mono w-12 text-right">{angleC}°</span>
        </div>
      </div>
    </div>
  );
};

// ==================== PYTHAGORAS VISUAL ====================
const PythagorasVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [sideA, setSideA] = useState(data.initialA ?? 3);
  const [sideB, setSideB] = useState(data.initialB ?? 4);
  const sideC = Math.sqrt(sideA * sideA + sideB * sideB);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const scale = 22;
    const ox = 60, oy = h - 50;
    const ax = ox, ay = oy;
    const bx = ox + sideB * scale, by = oy;
    const cx2 = ox, cy2 = oy - sideA * scale;

    // Triangle fill
    ctx.beginPath();
    ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx2, cy2); ctx.closePath();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.08)'; ctx.fill();
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.stroke();

    // Right angle marker
    const sq = 12;
    ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax + sq, ay); ctx.lineTo(ax + sq, ay - sq); ctx.lineTo(ax, ay - sq);
    ctx.stroke();

    // Side labels
    ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center';
    ctx.fillStyle = '#f97316';
    ctx.fillText(`a = ${sideA}`, ax - 25, (ay + cy2) / 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText(`b = ${sideB}`, (ax + bx) / 2, ay + 22);
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`c = ${sideC.toFixed(2)}`, (bx + cx2) / 2 + 20, (by + cy2) / 2 - 5);

    // Squares visualization
    const sqAlpha = 0.08;
    // a² square
    ctx.fillStyle = `rgba(249, 115, 22, ${sqAlpha})`;
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)'; ctx.lineWidth = 1;
    ctx.fillRect(ax - sideA * scale, ay - sideA * scale, sideA * scale, sideA * scale);
    ctx.strokeRect(ax - sideA * scale, ay - sideA * scale, sideA * scale, sideA * scale);
    // b² square
    ctx.fillStyle = `rgba(59, 130, 246, ${sqAlpha})`;
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fillRect(ax, ay, sideB * scale, sideB * scale);
    ctx.strokeRect(ax, ay, sideB * scale, sideB * scale);

    // Formula
    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`${sideA}² + ${sideB}² = ${(sideA * sideA)} + ${(sideB * sideB)} = ${(sideA * sideA + sideB * sideB)}`, w / 2, 24);
    ctx.fillText(`c = √${(sideA * sideA + sideB * sideB)} = ${sideC.toFixed(2)}`, w / 2, 44);
  }, [sideA, sideB, sideC]);

  useEffect(() => {
    if (onAnswer) onAnswer({ a: sideA, b: sideB, c: parseFloat(sideC.toFixed(2)) });
  }, [sideA, sideB, sideC]);

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={340} className="w-full rounded-xl border border-slate-700" style={{ maxWidth: 400 }} />
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-3">
          <label className="text-sm text-orange-400 w-16">Side a:</label>
          <input type="range" min={1} max={10} step={0.5} value={sideA} onChange={e => setSideA(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
          <span className="text-orange-400 font-mono w-10 text-right">{sideA}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-blue-400 w-16">Side b:</label>
          <input type="range" min={1} max={10} step={0.5} value={sideB} onChange={e => setSideB(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-blue-500" />
          <span className="text-blue-400 font-mono w-10 text-right">{sideB}</span>
        </div>
      </div>
    </div>
  );
};

// ==================== AREA EXPLORER VISUAL ====================
const AreaExplorerVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const shape = data.shape || 'circle';
  const [radius, setRadius] = useState(data.initialRadius ?? 3);
  const [base, setBase] = useState(data.initialBase ?? 6);
  const [height, setHeight] = useState(data.initialHeight ?? 4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const scale = 25;
    const cx = w / 2, cy = h / 2 + 20;

    if (shape === 'circle') {
      const r = radius * scale;
      // Grid overlay
      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.5;
      for (let gx = cx - r - scale; gx <= cx + r + scale; gx += scale) {
        ctx.beginPath(); ctx.moveTo(gx, cy - r - scale); ctx.lineTo(gx, cy + r + scale); ctx.stroke();
      }
      for (let gy = cy - r - scale; gy <= cy + r + scale; gy += scale) {
        ctx.beginPath(); ctx.moveTo(cx - r - scale, gy); ctx.lineTo(cx + r + scale, gy); ctx.stroke();
      }
      // Circle
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'; ctx.fill();
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.stroke();
      // Radius line
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + r, cy);
      ctx.strokeStyle = '#f97316'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
      // Labels
      ctx.fillStyle = '#f97316'; ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`r = ${radius}`, cx + r / 2, cy - 10);
      ctx.fillStyle = '#94a3b8'; ctx.font = '13px Inter';
      const area = Math.PI * radius * radius;
      ctx.fillText(`Area = π × ${radius}² = ${area.toFixed(2)} sq units`, w / 2, 24);
      if (onAnswer) onAnswer({ area: parseFloat(area.toFixed(2)) });
    } else if (shape === 'triangle') {
      const bw = base * scale, bh = height * scale;
      const lx = cx - bw / 2, ly = cy + bh / 2;
      ctx.beginPath();
      ctx.moveTo(lx, ly); ctx.lineTo(lx + bw, ly); ctx.lineTo(lx + bw / 2, ly - bh); ctx.closePath();
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'; ctx.fill();
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.stroke();
      // Height dashed
      ctx.beginPath(); ctx.moveTo(lx + bw / 2, ly); ctx.lineTo(lx + bw / 2, ly - bh);
      ctx.strokeStyle = '#f97316'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
      // Labels
      ctx.fillStyle = '#3b82f6'; ctx.font = 'bold 13px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`base = ${base}`, cx, ly + 18);
      ctx.fillStyle = '#f97316';
      ctx.fillText(`h = ${height}`, lx + bw / 2 + 28, cy);
      ctx.fillStyle = '#94a3b8'; ctx.font = '13px Inter';
      const area = 0.5 * base * height;
      ctx.fillText(`Area = ½ × ${base} × ${height} = ${area}`, w / 2, 24);
      if (onAnswer) onAnswer({ area });
    }
  }, [radius, base, height, shape]);

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={300} className="w-full rounded-xl border border-slate-700" style={{ maxWidth: 400 }} />
      <div className="mt-3 space-y-2">
        {shape === 'circle' && (
          <div className="flex items-center gap-3">
            <label className="text-sm text-orange-400 w-16">Radius:</label>
            <input type="range" min={1} max={6} step={0.5} value={radius} onChange={e => setRadius(parseFloat(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
            <span className="text-orange-400 font-mono w-10 text-right">{radius}</span>
          </div>
        )}
        {shape === 'triangle' && (
          <>
            <div className="flex items-center gap-3">
              <label className="text-sm text-blue-400 w-16">Base:</label>
              <input type="range" min={2} max={10} step={1} value={base} onChange={e => setBase(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-blue-500" />
              <span className="text-blue-400 font-mono w-10 text-right">{base}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-orange-400 w-16">Height:</label>
              <input type="range" min={2} max={10} step={1} value={height} onChange={e => setHeight(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
              <span className="text-orange-400 font-mono w-10 text-right">{height}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==================== GRADIENT EXPLORER VISUAL ====================
const GradientExplorerVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [x1, setX1] = useState(data.x1 ?? -2);
  const [y1, setY1] = useState(data.y1 ?? -1);
  const [x2, setX2] = useState(data.x2 ?? 3);
  const [y2, setY2] = useState(data.y2 ?? 4);
  const bounds = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

  const gradient = x2 !== x1 ? (y2 - y1) / (x2 - x1) : Infinity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, bounds, w, h);

    const p1 = toCanvas(x1, y1, bounds, { width: w, height: h });
    const p2 = toCanvas(x2, y2, bounds, { width: w, height: h });

    // Line through both points
    if (isFinite(gradient)) {
      const c = y1 - gradient * x1;
      const ly1 = gradient * bounds.xMin + c;
      const ly2 = gradient * bounds.xMax + c;
      const lp1 = toCanvas(bounds.xMin, ly1, bounds, { width: w, height: h });
      const lp2 = toCanvas(bounds.xMax, ly2, bounds, { width: w, height: h });
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(lp1.cx, lp1.cy); ctx.lineTo(lp2.cx, lp2.cy); ctx.stroke();
    }

    // Rise/run triangle
    ctx.strokeStyle = '#f97316'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
    ctx.beginPath(); ctx.moveTo(p1.cx, p1.cy); ctx.lineTo(p2.cx, p1.cy); ctx.lineTo(p2.cx, p2.cy); ctx.stroke();
    ctx.setLineDash([]);

    // Rise/run labels
    ctx.fillStyle = '#3b82f6'; ctx.font = '12px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`run = ${x2 - x1}`, (p1.cx + p2.cx) / 2, p1.cy + 16);
    ctx.fillStyle = '#f97316'; ctx.textAlign = 'left';
    ctx.fillText(`rise = ${y2 - y1}`, p2.cx + 6, (p1.cy + p2.cy) / 2);

    // Points
    [p1, p2].forEach(p => {
      ctx.beginPath(); ctx.arc(p.cx, p.cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Point labels
    ctx.fillStyle = '#fff'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
    ctx.fillText(`(${x1}, ${y1})`, p1.cx, p1.cy - 12);
    ctx.fillText(`(${x2}, ${y2})`, p2.cx, p2.cy - 12);

    // Gradient label
    ctx.fillStyle = '#22c55e'; ctx.font = 'bold 14px Inter'; ctx.textAlign = 'left';
    ctx.fillText(`Gradient = rise/run = ${y2 - y1}/${x2 - x1} = ${isFinite(gradient) ? gradient.toFixed(2) : '∞'}`, 12, 24);
  }, [x1, y1, x2, y2, gradient, bounds]);

  useEffect(() => {
    if (onAnswer) onAnswer({ gradient: isFinite(gradient) ? parseFloat(gradient.toFixed(2)) : null });
  }, [gradient]);

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={360} className="w-full rounded-xl border border-slate-700" style={{ maxWidth: 400 }} />
      <div className="mt-3 space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <label className="text-slate-400">x₁:</label>
            <input type="range" min={-5} max={5} step={1} value={x1} onChange={e => setX1(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
            <span className="text-orange-400 font-mono">{x1}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-400">y₁:</label>
            <input type="range" min={-5} max={5} step={1} value={y1} onChange={e => setY1(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-orange-500" />
            <span className="text-orange-400 font-mono">{y1}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-400">x₂:</label>
            <input type="range" min={-5} max={5} step={1} value={x2} onChange={e => setX2(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-blue-500" />
            <span className="text-blue-400 font-mono">{x2}</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-400">y₂:</label>
            <input type="range" min={-5} max={5} step={1} value={y2} onChange={e => setY2(parseInt(e.target.value))} disabled={disabled} className="flex-1 accent-blue-500" />
            <span className="text-blue-400 font-mono">{y2}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== POINT PLOTTER (ANSWER MODE) ====================
// Unlike the exploratory visuals above, this is an ANSWER widget: the student
// places one point and that placement IS their answer. Reference points
// (`data.markers`) are shown so transformation/midpoint problems make sense.
const PointPlotterVisual = ({ data, onAnswer, disabled }) => {
  const canvasRef = useRef(null);
  const [point, setPoint] = useState(null);
  const bounds = data.bounds || { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, bounds, w, h);

    // Reference markers (given points: original point, A & B, etc.)
    (data.markers || []).forEach(mk => {
      const { cx, cy } = toCanvas(mk.x, mk.y, bounds, { width: w, height: h });
      ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.85)'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
      ctx.fillText(mk.label || `(${mk.x},${mk.y})`, cx, cy - 12);
    });

    // The student's placed point (their answer)
    if (point) {
      const { cx, cy } = toCanvas(point.x, point.y, bounds, { width: w, height: h });
      ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e'; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = '11px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`(${point.x},${point.y})`, cx, cy - 12);
    }
  }, [point, bounds, data]);

  useEffect(() => { draw(); }, [draw]);

  const handleClick = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const { x, y } = toMath((e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy,
      bounds, { width: canvas.width, height: canvas.height });
    const p = { x: Math.round(x), y: Math.round(y) };
    setPoint(p);
    if (onAnswer) onAnswer(p);
  };

  return (
    <div className="mb-4">
      <canvas ref={canvasRef} width={360} height={360} onClick={handleClick}
        className="w-full rounded-xl border border-slate-700 cursor-crosshair" style={{ maxWidth: 400 }} />
      <p className="text-xs text-slate-500 mt-2">Click the grid to place your point.</p>
      {point && <p className="text-xs text-emerald-400 mt-1">Your point: ({point.x}, {point.y})</p>}
    </div>
  );
};

// ==================== FRACTION BAR (CONCRETE) ====================
// A bar split into `total` equal parts. The student shades parts from the left
// to build a fraction — concrete understanding of "n out of d equal parts".
const FractionBarVisual = ({ data, onAnswer, disabled }) => {
  const total = data.total || 4;
  const isShow = data.mode === 'show';
  const [shaded, setShaded] = useState(isShow ? (data.shaded || 0) : 0);
  const W = 360, H = 64, seg = W / total;

  const click = (i) => {
    if (disabled || isShow) return;
    const next = (i + 1 === shaded) ? i : i + 1;   // click the last shaded to unshade
    setShaded(next);
    if (onAnswer) onAnswer({ shaded: next, total });
  };

  return (
    <div className="mb-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: 420 }}>
        {Array.from({ length: total }).map((_, i) => (
          <rect key={i} x={i * seg + 1} y={6} width={seg - 2} height={H - 12} rx="4"
            fill={i < shaded ? '#22c55e' : '#1e293b'} stroke="#475569" strokeWidth="1.5"
            onClick={() => click(i)} style={{ cursor: isShow ? 'default' : 'pointer' }} />
        ))}
      </svg>
      {!isShow && (
        <>
          <p className="text-xs text-slate-500 mt-2">Click to shade parts of the bar.</p>
          <p className="text-xs text-emerald-400 mt-1">Shaded: {shaded}/{total}</p>
        </>
      )}
    </div>
  );
};

// ==================== FRACTION NUMBER LINE (CONCRETE) ====================
// A 0→max line split into equal steps; the student clicks to place a fraction.
const FractionNumberLineVisual = ({ data, onAnswer, disabled }) => {
  const denom = data.denom || 4, max = data.max || 1;
  const steps = max * denom;
  const [k, setK] = useState(null);
  const W = 380, H = 70, pad = 24, lineY = 34;
  const xOf = (j) => pad + (j / steps) * (W - 2 * pad);

  const click = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (W / rect.width);
    const j = Math.max(0, Math.min(steps, Math.round(((x - pad) / (W - 2 * pad)) * steps)));
    setK(j);
    if (onAnswer) onAnswer({ value: j / denom, k: j, denom });
  };

  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; };
  const label = (j) => {
    if (j === 0) return '0';
    if (j === steps) return `${max}`;
    const g = gcd(j, denom); return `${j / g}/${denom / g}`;
  };

  return (
    <div className="mb-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-pointer" style={{ maxWidth: 440 }} onClick={click}>
        <line x1={pad} y1={lineY} x2={W - pad} y2={lineY} stroke="#64748b" strokeWidth="2" />
        {Array.from({ length: steps + 1 }).map((_, j) => (
          <g key={j}>
            <line x1={xOf(j)} y1={lineY - 7} x2={xOf(j)} y2={lineY + 7} stroke="#64748b" strokeWidth="1.5" />
            <text x={xOf(j)} y={lineY + 22} fill="#94a3b8" fontSize="9" textAnchor="middle">{label(j)}</text>
          </g>
        ))}
        {k != null && <circle cx={xOf(k)} cy={lineY} r="7" fill="#22c55e" />}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Click the number line to place the fraction.</p>
    </div>
  );
};

// ==================== FRACTION COMPARE (PICTORIAL) ====================
// Display-only: shows fractions as bars so different-sized pieces are visible —
// the "why you need a common denominator" insight, made literal.
const FractionCompareVisual = ({ data }) => {
  const fractions = data.fractions || [];
  const W = 360, barH = 40, gap = 14;
  return (
    <div className="mb-4">
      <svg viewBox={`0 0 ${W} ${(barH + gap) * fractions.length}`} className="w-full" style={{ maxWidth: 420 }}>
        {fractions.map((f, row) => {
          const seg = W / f.d, y = row * (barH + gap);
          return (
            <g key={row}>
              {Array.from({ length: f.d }).map((_, i) => (
                <rect key={i} x={i * seg + 1} y={y} width={seg - 2} height={barH} rx="3"
                  fill={i < f.n ? (f.color || '#22c55e') : '#1e293b'} stroke="#475569" strokeWidth="1" />
              ))}
              <text x={W - 4} y={y + barH / 2 + 4} fill="#cbd5e1" fontSize="13" textAnchor="end" fontWeight="600">{f.n}/{f.d}</text>
            </g>
          );
        })}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Notice the pieces are different sizes.</p>
    </div>
  );
};

// ==================== INTEGER NUMBER LINE (CONCRETE) ====================
// A number line spanning negatives. Used to (a) place an integer, and (b) model
// add/subtract as JUMPS: a start marker is shown, the student lands the answer.
const IntegerLineVisual = ({ data, onAnswer, disabled }) => {
  const min = data.min ?? -10, max = data.max ?? 10, span = max - min;
  const [sel, setSel] = useState(null);
  const W = 460, H = 84, pad = 22, lineY = 42;
  const xOf = (v) => pad + ((v - min) / span) * (W - 2 * pad);

  const click = (e) => {
    if (disabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) * (W / r.width);
    const v = Math.max(min, Math.min(max, Math.round(min + ((x - pad) / (W - 2 * pad)) * span)));
    setSel(v);
    if (onAnswer) onAnswer({ value: v });
  };

  return (
    <div className="mb-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-pointer" style={{ maxWidth: 480 }} onClick={click}>
        <line x1={pad} y1={lineY} x2={W - pad} y2={lineY} stroke="#64748b" strokeWidth="2" />
        {Array.from({ length: span + 1 }).map((_, i) => {
          const v = min + i;
          return (
            <g key={v}>
              <line x1={xOf(v)} y1={lineY - 6} x2={xOf(v)} y2={lineY + 6} stroke={v === 0 ? '#e2e8f0' : '#64748b'} strokeWidth={v === 0 ? 2 : 1} />
              <text x={xOf(v)} y={lineY + 20} fill="#94a3b8" fontSize="9" textAnchor="middle">{v}</text>
            </g>
          );
        })}
        {data.start != null && (
          <g>
            <circle cx={xOf(data.start)} cy={lineY} r="6" fill="#3b82f6" />
            <text x={xOf(data.start)} y={lineY - 12} fill="#93c5fd" fontSize="10" textAnchor="middle">start</text>
          </g>
        )}
        {sel != null && <circle cx={xOf(sel)} cy={lineY} r="7" fill="#22c55e" />}
      </svg>
      <p className="text-xs text-slate-500 mt-1">Click the number line to land your answer.</p>
      {sel != null && <p className="text-xs text-emerald-400 mt-0.5">You landed on {sel}.</p>}
    </div>
  );
};

// ==================== DECIMAL GRID (CONCRETE) ====================
// A 10×10 grid = one whole; each square is 0.01. Shade squares to build a
// decimal (0.42 = 42 shaded). Makes "tenths and hundredths" tangible.
const DecimalGridVisual = ({ data, onAnswer, disabled }) => {
  const isShow = data.mode === 'show';
  const [shaded, setShaded] = useState(isShow ? (data.shaded || 0) : 0);
  const W = 240, cell = W / 10;

  const click = (i) => {
    if (disabled || isShow) return;
    const next = (i + 1 === shaded) ? i : i + 1;   // fill row-major up to clicked square
    setShaded(next);
    if (onAnswer) onAnswer({ shaded: next, total: 100 });
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${W}`} className="w-full" style={{ maxWidth: 250 }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const r = Math.floor(i / 10), c = i % 10;
          return <rect key={i} x={c * cell} y={r * cell} width={cell - 1} height={cell - 1}
            fill={i < shaded ? '#22c55e' : '#1e293b'} stroke="#475569" strokeWidth="0.5"
            onClick={() => click(i)} style={{ cursor: isShow ? 'default' : 'pointer' }} />;
        })}
      </svg>
      {!isShow && <p className="text-xs text-emerald-400 mt-2">Shaded: {shaded}/100 = {shaded / 100}</p>}
    </div>
  );
};

// ==================== ARRAY MODEL (CONCRETE) ====================
// Dots in rows × columns — multiplication as "rows of", division as "shared
// into equal rows". Rows are colour-coded so the groups are obvious.
const ArrayDotsVisual = ({ data }) => {
  const { rows, cols, groupByRow } = data;
  const r = 9, gap = 8, pad = 12, step = 2 * r + gap;
  const W = pad * 2 + cols * step - gap, H = pad * 2 + rows * step - gap;
  const colors = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6'];
  const dots = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push(<circle key={`${i}-${j}`} cx={pad + r + j * step} cy={pad + r + i * step} r={r}
        fill={groupByRow ? colors[i % colors.length] : '#22c55e'} />);
    }
  }
  return (
    <div className="mb-4 flex justify-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: Math.min(W, 340) }}>{dots}</svg>
    </div>
  );
};

// ==================== PLACE-VALUE CHART (PICTORIAL) ====================
// Shows a number's digits in labelled columns (1000s, 100s, 10s, 1s) with one
// highlighted — so "the value of a digit depends on its column" is visible.
const PlaceValueChartVisual = ({ data }) => {
  const { digits, labels, highlight } = data;
  const colW = 74, top = 4, headH = 26, cellH = 44, W = digits.length * colW;
  return (
    <div className="mb-4 flex justify-center">
      <svg viewBox={`0 0 ${W} ${top + headH + cellH + 6}`} className="w-full" style={{ maxWidth: Math.min(W + 8, 460) }}>
        {digits.map((d, i) => {
          const x = i * colW, hl = i === highlight;
          return (
            <g key={i}>
              <rect x={x + 2} y={top} width={colW - 4} height={headH} fill="#1e293b" stroke="#475569" />
              <text x={x + colW / 2} y={top + headH / 2 + 4} fill="#94a3b8" fontSize="11" textAnchor="middle">{labels[i]}</text>
              <rect x={x + 2} y={top + headH + 2} width={colW - 4} height={cellH} fill={hl ? '#a855f7' : '#0f172a'} stroke="#475569" />
              <text x={x + colW / 2} y={top + headH + 2 + cellH / 2 + 9} fill="#fff" fontSize="26" textAnchor="middle" fontWeight="700">{d}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ==================== FRACTION AREA MODEL (PICTORIAL) ====================
// a/b × c/d shown as overlap on a grid: shade a/b of the columns one way and
// c/d of the rows another — the doubly-shaded squares ARE the product. The
// canonical way to see why you "multiply across".
const FractionAreaVisual = ({ data }) => {
  const { a, b, c, d } = data;
  const W = 230, H = 230, cw = W / b, ch = H / d;
  const cells = [];
  for (let col = 0; col < b; col++) {
    for (let row = 0; row < d; row++) {
      const inCol = col < a, inRow = row < c;
      let fill = '#0f172a';
      if (inCol && inRow) fill = '#a855f7';            // overlap = product
      else if (inCol) fill = 'rgba(34,197,94,0.4)';    // a/b of columns
      else if (inRow) fill = 'rgba(59,130,246,0.4)';   // c/d of rows
      cells.push(<rect key={`${col}-${row}`} x={col * cw} y={row * ch} width={cw} height={ch}
        fill={fill} stroke="#475569" strokeWidth="1" />);
    }
  }
  return (
    <div className="mb-4 flex flex-col items-center">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxWidth: 250 }}>{cells}</svg>
      <p className="text-xs text-slate-500 mt-2 text-center">
        {a}/{b} of the columns × {c}/{d} of the rows — the purple overlap is the answer.
      </p>
    </div>
  );
};

// ==================== MAIN DISPATCHER ====================
const VISUAL_COMPONENTS = {
  linear_graph: LinearGraphVisual,
  coordinate_plot: CoordinatePlotterVisual,
  quadratic_graph: QuadraticGraphVisual,
  angle_explorer: AngleExplorerVisual,
  triangle_explorer: TriangleExplorerVisual,
  pythagoras: PythagorasVisual,
  area_explorer: AreaExplorerVisual,
  gradient_explorer: GradientExplorerVisual,
  plot_point: PointPlotterVisual,
  fraction_bar: FractionBarVisual,
  number_line: FractionNumberLineVisual,
  fraction_compare: FractionCompareVisual,
  fraction_area: FractionAreaVisual,
  integer_line: IntegerLineVisual,
  decimal_grid: DecimalGridVisual,
  place_value_chart: PlaceValueChartVisual,
  array_dots: ArrayDotsVisual,
};

export const InteractiveVisual = ({ visualType, visualData, onAnswer, disabled }) => {
  const Component = VISUAL_COMPONENTS[visualType];
  if (!Component) return null;
  return (
    <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 border border-slate-700">
      <div className="flex items-center gap-2 text-emerald-400 mb-3">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        <span className="text-sm font-semibold">Interactive Visual</span>
        <span className="text-xs text-slate-500 ml-auto">Adjust sliders to explore</span>
      </div>
      <Component data={visualData || {}} onAnswer={onAnswer} disabled={disabled} />
    </div>
  );
};

// Map skill IDs to their visual type (only skills that have visuals)
export const SKILL_VISUALS = {
  G5_ANGLES_INTRO: { visualType: 'angle_explorer', visualData: { initialAngle: 45 } },
  G6_ANGLE_MEASURE: { visualType: 'angle_explorer', visualData: { initialAngle: 30 } },
  G6_TRIANGLE_PROPERTIES: { visualType: 'triangle_explorer', visualData: { initialA: 60, initialB: 60 } },
  G6_AREA_TRIANGLE: { visualType: 'area_explorer', visualData: { shape: 'triangle', initialBase: 6, initialHeight: 4 } },
  G7_PYTHAGORAS: { visualType: 'pythagoras', visualData: { initialA: 3, initialB: 4 } },
  G7_AREA_CIRCLE: { visualType: 'area_explorer', visualData: { shape: 'circle', initialRadius: 3 } },
  G8_COORDINATES: { visualType: 'coordinate_plot', visualData: { bounds: { xMin: -6, xMax: 6, yMin: -6, yMax: 6 } } },
  G8_LINEAR_GRAPHS: { visualType: 'linear_graph', visualData: { initialM: 1, initialC: 0, showTarget: false } },
  G8_GRADIENT: { visualType: 'gradient_explorer', visualData: { x1: -2, y1: -1, x2: 3, y2: 4 } },
  G8_EQUATION_OF_LINE: { visualType: 'linear_graph', visualData: { initialM: 0, initialC: 0, showTarget: true, targetM: 2, targetC: -1 } },
  G9_QUADRATIC_GRAPHS: { visualType: 'quadratic_graph', visualData: { initialA: 1, initialH: 0, initialK: 0, showTarget: false } },
  G9_COMPLETING_SQUARE: { visualType: 'quadratic_graph', visualData: { initialA: 1, initialH: 0, initialK: 0, showTarget: true, targetA: 1, targetH: 2, targetK: -3 } },
};

export default InteractiveVisual;
