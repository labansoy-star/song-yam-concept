// 3D views built from the same model: isometric cutaway axonometric and one-point interior perspective
(() => {
  const { W, D, EAVE, RIDGE, C, el, col } = SY;
  const f = n => +n.toFixed(1);
  const shade = (hex, k) => {
    const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    const m = v => Math.max(0, Math.min(255, Math.round(v * k)));
    return `rgb(${m(r)},${m(g)},${m(b)})`;
  };
  const box = (x, y, z, w, d, h, fill, extra = {}) => ({ x, y, z, w, d, h, fill, ...extra });

  function items(night) {
    const P = night
      ? { floor: '#3B302A', pave: '#2E2724', wall: '#3D3344', part: '#463B4C', wood: '#6A452C', woodL: '#8A5E3C', ss: '#8C9196', stool: C.cushion }
      : { floor: '#D8CAB0', pave: '#CFC3AD', wall: C.wall, part: '#E6D8B9', wood: C.wood, woodL: C.woodL, ss: C.ss, stool: '#B98A5C' };
    const L = [];
    L.push(box(-0.2, -3.6, -0.1, W + 0.4, 3.6, 0.1, P.pave, { flat: 1 }));
    L.push(box(-0.15, 0, -0.12, W + 0.3, D + 0.15, 0.12, P.floor, { flat: 1 }));
    L.push(box(6.6, 1.4, 0, 2.3, 5.6, 0.006, night ? '#4A3A33' : C.wash, { flat: 1 }));
    L.push(box(-0.15, D, 0, W + 0.3, 0.15, EAVE, P.wall));
    L.push(box(SY.backDoor[0], D - 0.01, 0, 0.9, 0.01, 2.1, '#3A2C24'));
    L.push(box(W, 0, 0, 0.15, D, EAVE, P.wall));
    L.push(box(-0.15, 0, 0, 0.15, D, 0.45, P.wall));
    [[-0.15, 0.15], [3.8, 3.95], [4.95, 5.1], [8.75, W + 0.15]].forEach(([a, b]) => L.push(box(a, -0.1, 0, b - a, 0.2, 0.45, C.steel)));
    SY.partitions.forEach(([x1, y1, x2, y2]) => L.push(y1 === y2 ? box(x1, y1 - 0.05, 0, x2 - x1, 0.1, 2.4, P.part) : box(x1 - 0.05, y1, 0, 0.1, y2 - y1, 2.4, P.part)));
    L.push(box(col.x - 0.08, col.y - 0.08, 0, 0.16, 0.16, 3.7, C.steel));
    L.push(box(6.6, 1.4, 0, 0.6, 5.6, 1.05, P.woodL));
    L.push(box(8.25, 1.4, 0, 0.65, 5.6, 0.9, P.ss));
    L.push(box(7.95, 3.25, 2.05, 0.95, 3.7, 0.45, P.ss));
    L.push(box(8.3, 7.2, 0, 0.58, 1.6, 0.9, P.ss), box(8.3, 9.1, 0, 0.58, 0.75, 1.9, '#EDEDEA'), box(6.75, 8.6, 0, 0.6, 1.2, 0.9, P.ss));
    L.push(box(3.7, 9.58, 0, 2.8, 0.36, 1.8, P.wood));
    L.push(box(0.25, 9.3, 0, 0.4, 0.55, 0.42, '#F4F4F2'));
    if (!night) {
      SY.dayTables.forEach(([x, y, w, d]) => {
        L.push(box(x + 0.08, y + 0.1, 0, 0.05, d - 0.2, 0.7, P.wood), box(x + w - 0.13, y + 0.1, 0, 0.05, d - 0.2, 0.7, P.wood));
        L.push(box(x, y, 0.7, w, d, 0.05, P.woodL));
      });
      SY.dayStools.forEach(([x, y]) => L.push(box(x - 0.15, y - 0.15, 0, 0.3, 0.3, 0.45, P.stool)));
      SY.cartsDay.forEach(([x, y, w, d]) => L.push(box(x, y, 0, w, d, 0.95, P.ss)));
      L.push(box(0.3, -0.75, 0, 0.6, 0.4, 0.45, '#8A6B52'), box(8.0, -0.75, 0, 0.6, 0.4, 0.45, '#8A6B52'));
      L.push(box(0.35, -0.7, 0.45, 0.5, 0.3, 0.45, C.green), box(8.05, -0.7, 0.45, 0.5, 0.3, 0.45, C.green));
    } else {
      SY.nightTables.concat(SY.outTables).forEach(([x, y]) => { L.push(box(x - 0.06, y - 0.06, 0, 0.12, 0.12, 0.65, P.wood), box(x - 0.4, y - 0.4, 0.65, 0.8, 0.8, 0.05, P.woodL)); });
      SY.nightStools.forEach(([x, y]) => L.push(box(x - 0.15, y - 0.15, 0, 0.3, 0.3, 0.42, P.stool)));
      SY.cartsNight.forEach(([x, y, w, d]) => { L.push(box(x, y, 0, w, d, 0.92, P.ss), box(x, y, 0.92, w, d, 0.3, '#9FC3CC', { glass: 1 })); });
      SY.screens.forEach(([x1, y1, x2]) => L.push(box(x1, y1 - 0.03, 0, x2 - x1, 0.06, 2.0, '#8C6A48', { lattice: 1 })));
    }
    return L;
  }

  function lanterns(night) {
    const list = SY.lanterns.map(([x, y, r]) => [x, y, 2.62, r * 0.55]);
    SY.facadeLanterns.forEach(([x, y]) => list.push([x, y, 2.2, 0.2]));
    return list;
  }

  // ---------- isometric ----------
  SY.drawAxo = mode => {
    const night = mode === 'night';
    const s = 33, c = 0.866, ox = 350, oy = 520;
    const P = (x, y, z) => [f(ox + (x - y) * c * s), f(oy - (x + y) * 0.5 * s - z * s)];
    const poly = (pts, o) => el('polygon', { points: pts.map(p => P(...p).join(',')).join(' '), ...o });
    const line = night ? '#0D0D12' : C.ink;
    const L = items(night).map(b => ({ ...b, k: b.x + b.w / 2 + b.y + b.d / 2 }));
    L.sort((a, b) => (b.k - a.k) || (a.z - b.z));
    let g = night ? el('rect', { x: 0, y: 0, width: 720, height: 560, fill: C.night }) : '';
    g += el('defs', {}, el('pattern', { id: `lat-${mode}`, width: 8, height: 8, patternUnits: 'userSpaceOnUse' },
      el('rect', { width: 8, height: 8, fill: '#8C6A48' }) + el('path', { d: 'M0 4H8M4 0V8', stroke: '#3A2616', 'stroke-width': 1.2 })));
    L.forEach(b => {
      const { x, y, z, w, d, h } = b, st = { stroke: line, 'stroke-width': 0.6, 'stroke-linejoin': 'round' };
      const fillT = b.lattice ? `url(#lat-${mode})` : b.fill;
      const op = b.glass ? { 'fill-opacity': 0.5 } : {};
      if (!b.flat) {
        g += poly([[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]], { fill: b.lattice ? fillT : shade(b.fill, 0.82), ...st, ...op });
        g += poly([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]], { fill: b.lattice ? fillT : shade(b.fill, 0.68), ...st, ...op });
      }
      g += poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], { fill: fillT, ...st, ...op });
    });
    if (!night) SY.dayLights.forEach(([x1, y1, x2, y2]) => { const a = P(x1, y1, 2.9), b = P(x2, y2, 2.9); g += el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#FFFFFF', 'stroke-width': 3.5 }) + el('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: C.ink, 'stroke-width': 0.6 }); });
    lanterns(night).forEach(([x, y, z, r]) => {
      const [px, py] = P(x, y, z), top = P(x, y, 3.3);
      g += el('line', { x1: px, y1: top[1], x2: px, y2: py, stroke: night ? '#8E889A' : C.graph, 'stroke-width': 0.6 });
      if (night) g += el('circle', { cx: px, cy: py, r: f(r * s * 3.2), fill: C.lantern, 'fill-opacity': 0.13 }) + el('circle', { cx: px, cy: py, r: f(r * s * 1.9), fill: C.lantern, 'fill-opacity': 0.2 });
      g += el('ellipse', { cx: px, cy: py, rx: f(r * s), ry: f(r * s * 1.15), fill: night ? C.lantern : '#C4463A', stroke: C.seal, 'stroke-width': 0.8 });
    });
    const lab = (x, y, z, t, o = {}) => { const [px, py] = P(x, y, z); return el('text', { x: px, y: py, 'text-anchor': 'middle', 'font-family': 'IBM Plex Sans Thai, sans-serif', 'font-size': 12, 'font-weight': 500, fill: night ? '#F1E8D6' : C.ink, stroke: night ? C.night : C.sheet, 'stroke-width': 3.5, 'paint-order': 'stroke', ...o }, t); };
    g += lab(7.6, 4.2, 2.9, 'เคาน์เตอร์โชว์') + lab(7.9, 8.6, 2.2, 'ครัวเตรียม') + lab(5.1, 8.9, 2.7, 'คลัง') + lab(0.9, 9.0, 2.6, 'ห้องน้ำ') + lab(4.45, -2.6, 0.1, 'ลานหน้าร้าน (ใต้กันสาดเดิม)');
    g += night ? lab(0.4, 2.6, 1.6, 'บาร์หมาล่า', { fill: C.lantern }) + lab(3.9, 4.3, 3.2, 'โถงโรงเตี๊ยม · 48 ที่') : lab(3.3, 4.5, 2.2, 'โถงอาหารเช้า · 36 ที่');
    return `<svg viewBox="0 0 720 560" role="img" aria-label="ภาพแอกโซโนเมตริกตัดหลังคา โหมด${night ? 'ค่ำ' : 'เช้า'}">${g}</svg>`;
  };

  // ---------- one-point perspective from the doorway ----------
  SY.drawPersp = mode => {
    const night = mode === 'night';
    const VW = 680, VH = 430, F = 340, cx = 340, cy = 205, E = { x: col.x - 0.15, y: -0.7, z: 1.55 };
    const Pj = (x, y, z) => { const dz = y - E.y; return [f(cx + F * (x - E.x) / dz), f(cy - F * (z - E.z) / dz)]; };
    const poly = (pts, o) => el('polygon', { points: pts.map(p => Pj(...p).join(',')).join(' '), ...o });
    const ln = (a, b, o) => { const p = Pj(...a), q = Pj(...b); return el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], ...o }); };
    const line = night ? '#101016' : C.ink;
    const pal = night
      ? { floor: '#3A2E28', wall: '#3A3040', back: '#43374A', roof: '#1F1D28', steel: '#0E0E12', band: '#2C2735' }
      : { floor: '#DCCDB2', wall: '#EFE4CC', back: '#F3E9D3', roof: '#D6D1C6', steel: '#2F2F2F', band: '#E2D8C2' };
    let g = el('rect', { x: 0, y: 0, width: VW, height: VH, fill: night ? C.night : C.sheet });
    const st = { stroke: line, 'stroke-width': 0.7, 'stroke-linejoin': 'round' };
    g += poly([[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0]], { fill: pal.floor, ...st });
    for (let y = 1.2; y < D; y += 1.2) g += ln([0, y, 0], [W, y, 0], { stroke: line, 'stroke-width': 0.35, 'stroke-opacity': 0.5 });
    for (let x = 1.48; x < W; x += 1.48) g += ln([x, 0, 0], [x, D, 0], { stroke: line, 'stroke-width': 0.35, 'stroke-opacity': 0.5 });
    g += poly([[0, 0, 0], [0, D, 0], [0, D, EAVE], [0, 0, EAVE]], { fill: pal.wall, ...st }) + poly([[W, 0, 0], [W, D, 0], [W, D, EAVE], [W, 0, EAVE]], { fill: pal.wall, ...st });
    g += poly([[0, 0, 2.3], [0, D, 2.3], [0, D, EAVE], [0, 0, EAVE]], { fill: pal.band, ...st }) + poly([[W, 0, 2.3], [W, D, 2.3], [W, D, EAVE], [W, 0, EAVE]], { fill: pal.band, ...st });
    for (let y = 0.4; y < D; y += 0.4) g += ln([0, y, 2.3], [0, y, EAVE], { stroke: line, 'stroke-width': 0.4 }) + ln([W, y, 2.3], [W, y, EAVE], { stroke: line, 'stroke-width': 0.4 });
    g += poly([[0, D, 0], [W, D, 0], [W, D, EAVE], [col.x, D, RIDGE], [0, D, EAVE]], { fill: pal.back, ...st });
    g += poly([[0, 0, EAVE], [col.x, 0, RIDGE], [col.x, D, RIDGE], [0, D, EAVE]], { fill: pal.roof, ...st }) + poly([[W, 0, EAVE], [col.x, 0, RIDGE], [col.x, D, RIDGE], [W, D, EAVE]], { fill: shade(night ? '#1F1D28' : '#D6D1C6', 0.93), ...st });
    for (let i = 1; i < 6; i++) { const t = i / 6; g += ln([t * col.x, 0, EAVE + t * (RIDGE - EAVE)], [t * col.x, D, EAVE + t * (RIDGE - EAVE)], { stroke: pal.steel, 'stroke-width': 0.8 }) + ln([W - t * (W - col.x), 0, EAVE + t * (RIDGE - EAVE)], [W - t * (W - col.x), D, EAVE + t * (RIDGE - EAVE)], { stroke: pal.steel, 'stroke-width': 0.8 }); }
    [1.25, 3.75, 6.25, 8.75].forEach(y => { g += ln([0, y, EAVE], [col.x, y, RIDGE], { stroke: pal.steel, 'stroke-width': 2 }) + ln([col.x, y, RIDGE], [W, y, EAVE], { stroke: pal.steel, 'stroke-width': 2 }); });
    const bx = items(night).filter(b => b.y >= 0 && b.z > -0.05 && !(b.w > 8 && b.h < 0.2) && !(b.x < 0 && b.h <= 0.45) && !(b.y + b.d > D - 0.02 && b.w > 8) && !(b.x >= W - 0.01 && b.d > 9) && b.h > 0.01);
    bx.sort((a, b) => (b.y + b.d / 2) - (a.y + a.d / 2) || a.z - b.z);
    bx.forEach(b => {
      const { x, y, z, w, d, h } = b, fl = b.lattice ? '#8C6A48' : b.fill, op = b.glass ? { 'fill-opacity': 0.45 } : {};
      if (x > E.x) g += poly([[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]], { fill: shade(fl, 0.78), ...st, ...op });
      if (x + w < E.x) g += poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], { fill: shade(fl, 0.78), ...st, ...op });
      if (z + h < E.z) g += poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], { fill: fl, ...st, ...op });
      if (z > E.z) g += poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]], { fill: shade(fl, 0.6), ...st, ...op });
      g += poly([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]], { fill: shade(fl, 0.9), ...st, ...op });
      if (b.lattice) for (let t = 0.2; t < w; t += 0.2) g += ln([x + t, y, z], [x + t, y, z + h], { stroke: '#3A2616', 'stroke-width': 0.6 });
      if (b.lattice) for (let t = 0.2; t < h; t += 0.2) g += ln([x, y, z + t], [x + w, y, z + t], { stroke: '#3A2616', 'stroke-width': 0.6 });
    });
    const people = night ? [[1.48, 6.5, 'sit'], [2.72, 6.5, 'sit'], [5.0, 6.5, 'sit'], [6.22, 6.5, 'sit'], [1.1, 2.0, 'stand'], [3.3, 2.3, 'sit']] : [[1.27, 5.33, 'sit'], [2.73, 6.67, 'sit'], [4.7, 5.33, 'sit'], [7.7, 4.4, 'stand'], [6.2, 3.0, 'stand']];
    people.sort((a, b) => b[1] - a[1]).forEach(([x, y, pose]) => {
      const [px, py] = Pj(x, y, 0), k = F / (y - E.y), h = pose === 'sit' ? 1.2 : 1.66;
      const top = py - h * k, fill = night ? '#0C0C10' : '#8F8A82';
      g += el('circle', { cx: px, cy: f(top + 0.12 * k), r: f(0.11 * k), fill });
      g += el('rect', { x: f(px - 0.2 * k), y: f(top + 0.26 * k), width: f(0.4 * k), height: f((h - (pose === 'sit' ? 0.7 : 0.26)) * k), rx: f(0.12 * k), fill });
    });
    if (!night) SY.dayLights.slice(0, 2).forEach(([x, y1, , y2]) => { g += ln([x, y1, 2.9], [x, y2, 2.9], { stroke: '#FFFFFF', 'stroke-width': 3 }) + ln([x, y1, 2.9], [x, y2, 2.9], { stroke: line, 'stroke-width': 0.5 }); });
    lanterns(night).filter(l => l[1] > 0).sort((a, b) => b[1] - a[1]).forEach(([x, y, z, r]) => {
      const [px, py] = Pj(x, y, z), k = F / (y - E.y), top = Pj(x, y, 3.5);
      g += el('line', { x1: px, y1: top[1], x2: px, y2: py, stroke: night ? '#6E6878' : C.graph, 'stroke-width': 0.6 });
      if (night) g += el('circle', { cx: px, cy: py, r: f(r * k * 3.4), fill: C.lantern, 'fill-opacity': 0.12 }) + el('circle', { cx: px, cy: py, r: f(r * k * 2), fill: C.lantern, 'fill-opacity': 0.18 });
      g += el('ellipse', { cx: px, cy: py, rx: f(r * k), ry: f(r * k * 1.15), fill: night ? C.lantern : '#C4463A', stroke: C.seal, 'stroke-width': 0.8 });
      if (night) g += el('ellipse', { cx: px, cy: py, rx: f(r * k * 0.5), ry: f(r * k * 0.7), fill: '#FFE2A8' });
    });
    return `<svg viewBox="0 0 ${VW} ${VH}" role="img" aria-label="ทัศนียภาพภายในจากประตูหน้า โหมด${night ? 'ค่ำ' : 'เช้า'}">${g}</svg>`;
  };
})();
