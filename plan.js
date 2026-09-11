// Plan-type drawings: existing survey, day/night floor plan, reflected ceiling & lighting plan
SY.drawPlan = (() => {
  const { W, D, T, C, el, backDoor, win, col, canopy, stations } = SY;
  const s = 60, ox = 100, oy = 80;
  const VBW = ox + (W + 1.8) * s, VBH = oy + (D + 5.4) * s;
  const f = n => +n.toFixed(1);
  const X = x => f(ox + x * s), Y = y => f(oy + (D - y) * s);
  const R = (x, y, w, h, o = {}) => el('rect', { x: X(x), y: Y(y + h), width: f(w * s), height: f(h * s), ...o });
  const L = (x1, y1, x2, y2, o = {}) => el('line', { x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), ...o });
  const O = (x, y, r, o = {}) => el('circle', { cx: X(x), cy: Y(y), r: f(r * s), ...o });
  const mono = { 'font-family': 'IBM Plex Mono, monospace', 'font-size': 11.5, fill: C.ink };
  const sans = { 'font-family': 'IBM Plex Sans Thai, sans-serif', 'font-size': 13.5, fill: C.ink };
  const cjk = { 'font-family': 'Noto Serif SC, serif', 'font-weight': 700, 'font-size': 15, fill: C.seal };
  const Tx = (x, y, t, o = {}) => el('text', { x: X(x), y: Y(y), 'text-anchor': 'middle', ...sans, ...o }, t);
  const thin = { stroke: C.ink, 'stroke-width': 0.8, fill: 'none' };
  const dash = { stroke: C.ink, 'stroke-width': 0.8, fill: 'none', 'stroke-dasharray': '6 4' };

  const bubble = (cx, cy, t, r = 12) =>
    el('circle', { cx, cy, r, fill: C.sheet, stroke: C.ink, 'stroke-width': 1 }) +
    el('text', { x: cx, y: cy + 4.5, 'text-anchor': 'middle', ...mono, 'font-size': 13 }, t);
  const tick = (px, py) => el('line', { x1: px - 4, y1: py + 4, x2: px + 4, y2: py - 4, stroke: C.ink, 'stroke-width': 1.3 });

  function dimH(xs, y, labels, color = C.ink) {
    let g = L(xs[0] - 0.15, y, xs[xs.length - 1] + 0.15, y, { stroke: color, 'stroke-width': 0.6 });
    xs.forEach(x => { g += L(x, y - 0.14, x, y + 0.14, { stroke: color, 'stroke-width': 0.6 }) + tick(X(x), Y(y)); });
    for (let i = 0; i < xs.length - 1; i++) {
      const t = labels ? labels[i] : (xs[i + 1] - xs[i]).toFixed(2);
      g += el('text', { x: X((xs[i] + xs[i + 1]) / 2), y: Y(y) - 5, 'text-anchor': 'middle', ...mono, fill: color }, t);
    }
    return g;
  }
  function dimV(ys, x, labels, color = C.ink) {
    let g = L(x, ys[0] - 0.15, x, ys[ys.length - 1] + 0.15, { stroke: color, 'stroke-width': 0.6 });
    ys.forEach(y => { g += L(x - 0.14, y, x + 0.14, y, { stroke: color, 'stroke-width': 0.6 }) + tick(X(x), Y(y)); });
    for (let i = 0; i < ys.length - 1; i++) {
      const t = labels ? labels[i] : (ys[i + 1] - ys[i]).toFixed(2);
      const px = X(x) - 5, py = Y((ys[i] + ys[i + 1]) / 2);
      g += el('text', { x: px, y: py, 'text-anchor': 'middle', transform: `rotate(-90 ${px} ${py})`, ...mono, fill: color }, t);
    }
    return g;
  }
  const arcDoor = (hx, hy, lx, ly, ax, ay, sweep) =>
    L(hx, hy, lx, ly, { stroke: C.ink, 'stroke-width': 1.4 }) +
    el('path', { d: `M${X(lx)} ${Y(ly)} A${f(Math.hypot(lx - hx, ly - hy) * s)} ${f(Math.hypot(lx - hx, ly - hy) * s)} 0 0 ${sweep} ${X(ax)} ${Y(ay)}`, fill: 'none', stroke: C.ink, 'stroke-width': 0.6, 'stroke-dasharray': '3 3' });

  function grid() {
    const st = { stroke: C.graph, 'stroke-width': 0.6, 'stroke-dasharray': '16 4 2 4' };
    let g = '';
    [[0, '1'], [col.x, '2'], [W, '3']].forEach(([x, n]) => { g += L(x, D + 0.8, x, canopy.y0 - 0.2, st) + bubble(X(x), Y(D + 1.0), n); });
    [[0, 'A'], [col.y, 'B'], [D, 'C']].forEach(([y, n]) => { g += L(-0.2, y, W + 0.85, y, st) + bubble(X(W + 1.05), Y(y), n); });
    return g;
  }

  function shell() {
    const p = { fill: C.ink };
    let g = '';
    g += R(-T, 0.1, T, win[0] - 0.1, p) + R(-T, win[1], T, D + T - win[1], p);
    g += R(-T, win[0], T, win[1] - win[0], { fill: C.sheet, stroke: C.ink, 'stroke-width': 0.8 }) + L(-T / 2, win[0], -T / 2, win[1], { stroke: C.ink, 'stroke-width': 0.8 });
    g += R(W, 0.1, T, D + T - 0.1, p);
    g += R(-T, D, backDoor[0] + T, T, p) + R(backDoor[1], D, W + T - backDoor[1], T, p);
    g += arcDoor(backDoor[0], D, backDoor[0], D - 0.9, backDoor[1], D, 0);
    [[-T, 0.15], [3.8, 3.95], [4.95, 5.1], [8.75, W + T]].forEach(([a, b]) => { g += R(a, -0.1, b - a, 0.22, p); });
    [[0.15, 3.8], [5.1, 8.75]].forEach(([a, b]) => { g += L(a, 0, b, 0, { stroke: C.ink, 'stroke-width': 1.2, 'stroke-dasharray': '9 3 2 3' }); });
    g += arcDoor(3.95, 0, 3.95, 1.0, 4.95, 0, 1);
    g += R(col.x - 0.1, col.y - 0.1, 0.2, 0.2, { fill: C.ink });
    g += L(col.x, col.y, col.x - 0.7, col.y, { ...dash, 'stroke-width': 0.6 }) + L(col.x, col.y, col.x + 0.7, col.y, { ...dash, 'stroke-width': 0.6 });
    g += R(-0.2, canopy.y0, W + 0.4, -canopy.y0, { fill: 'none', stroke: C.graph, 'stroke-width': 0.8, 'stroke-dasharray': '12 5' });
    canopy.posts.forEach(x => { g += R(x - 0.08, canopy.y0, 0.16, 0.16, p); });
    g += L(-1.3, -4.0, W + 0.9, -4.0, { stroke: C.graph, 'stroke-width': 1 });
    g += el('text', { x: X(-1.25), y: Y(-4.0) - 6, ...mono, fill: C.graph }, 'แนวถนน');
    return g;
  }

  function partitionsAndBOH(night) {
    let g = '';
    SY.partitions.forEach(([x1, y1, x2, y2]) => { g += L(x1, y1, x2, y2, { stroke: C.graph, 'stroke-width': 6, 'stroke-linecap': 'square' }); });
    g += arcDoor(1.3, 7.9, 1.3, 8.7, 0.5, 7.9, 0);
    g += R(4.6, 7.93, 0.95, 0.06, { fill: C.sheet, stroke: C.ink, 'stroke-width': 0.8 });
    g += R(6.57, 8.35, 0.06, 0.9, { fill: C.sheet, stroke: C.ink, 'stroke-width': 0.8 });
    g += el('ellipse', { cx: X(0.45), cy: Y(9.45), rx: 11, ry: 16, ...thin }) + R(0.2, 9.8, 0.5, 0.18, thin);
    g += O(1.45, 9.7, 0.16, thin) + R(1.2, 9.85, 0.5, 0.12, thin);
    g += R(3.7, 9.58, 2.8, 0.36, { fill: `url(#hatch)`, stroke: C.ink, 'stroke-width': 0.6 });
    g += R(8.3, 7.2, 0.58, 1.6, thin) + L(8.3, 7.73, 8.88, 7.73, thin) + L(8.3, 8.27, 8.88, 8.27, thin);
    g += R(8.3, 9.1, 0.58, 0.75, thin) + L(8.3, 9.1, 8.88, 9.85, thin) + L(8.3, 9.85, 8.88, 9.1, thin);
    g += R(6.75, 8.6, 0.6, 1.2, { ...thin, fill: C.ss });
    (night ? [] : SY.cartsDay).forEach(([x, y, w, d]) => { g += R(x, y, w, d, { fill: '#DCE4E6', stroke: C.ink, 'stroke-width': 0.8 }); });
    if (night) SY.cartsDay.forEach(([x, y, w, d]) => { g += R(x, y, w, d, { ...dash, stroke: C.graph }); });
    const tag = (x, y, a, b) => Tx(x, y, a, { 'font-size': 12 }) + Tx(x, y - 0.28, b, { ...mono, 'font-size': 10.5, fill: C.graph });
    g += tag(0.95, 8.45, 'ห้องน้ำ', '3.8 ม²') + tag(2.7, 8.45, 'ทางพนักงาน', '3.8 ม²') + tag(6.05, 8.6, 'คลัง', '6.3 ม²') + tag(7.82, 9.45, 'ครัวเตรียม', '6.9 ม²');
    return g;
  }

  function kitchen(night) {
    let g = R(6.6, 1.4, 2.3, 5.6, { fill: night ? C.sheet : C.wash, stroke: 'none' });
    g += R(6.6, 1.4, 0.6, 5.6, { fill: C.woodL, stroke: C.ink, 'stroke-width': 0.8 });
    g += R(8.25, 1.4, 0.65, 5.6, { fill: C.ss, stroke: C.ink, 'stroke-width': 0.8 });
    stations.forEach(st => { if (st.y0 > 1.4) g += L(6.6, st.y0, 8.9, st.y0, { ...dash, 'stroke-width': 0.6 }); });
    g += O(8.57, 1.95, 0.22, { ...thin, fill: '#fff' }) + O(8.57, 2.65, 0.22, { ...thin, fill: '#fff' });
    g += R(8.32, 3.55, 0.5, 1.1, { ...thin, fill: '#fff' }) + R(8.4, 3.65, 0.34, 0.9, { ...thin, fill: C.lantern, 'fill-opacity': 0.35 });
    [[8.45, 5.35], [8.72, 5.35], [8.45, 5.72], [8.72, 5.72]].forEach(([x, y]) => { g += O(x, y, 0.11, { ...thin, fill: '#fff' }); });
    g += O(8.57, 6.45, 0.27, { ...thin, fill: '#fff' });
    g += R(7.95, 3.25, 0.93, 3.7, { ...dash, 'stroke-width': 0.9 }) + L(7.95, 3.25, 8.88, 6.95, { ...dash, 'stroke-width': 0.5 }) + L(7.95, 6.95, 8.88, 3.25, { ...dash, 'stroke-width': 0.5 });
    g += R(6.68, 1.5, 0.4, 0.3, { fill: C.ink });
    stations.forEach(st => {
      const m = (st.y0 + st.y1) / 2;
      g += Tx(7.72, m + 0.12, st.cjk, cjk) + Tx(7.72, m - 0.25, st.name, { 'font-size': 11, fill: C.graph });
    });
    g += Tx(7.75, 0.95, 'เคาน์เตอร์โชว์ 12.9 ม²', { 'font-size': 12 });
    if (night) {
      g += R(6.6, 1.4, 2.3, 5.6, { fill: 'url(#hatch)', stroke: 'none', opacity: 0.75 });
      g += R(6.85, 3.55, 1.75, 0.7, { fill: C.sheet, stroke: C.ink, 'stroke-width': 0.6 }) + Tx(7.72, 3.8, 'พักเคาน์เตอร์เช้า', { 'font-size': 11.5 });
    }
    return g;
  }

  function dayFurniture() {
    let g = '';
    SY.dayTables.forEach(([x, y, w, d]) => { g += R(x, y, w, d, { fill: C.woodL, stroke: C.ink, 'stroke-width': 0.8 }); });
    SY.dayStools.forEach(([x, y]) => { g += O(x, y, 0.16, { fill: C.sheet, stroke: C.ink, 'stroke-width': 0.8 }); });
    g += R(0.3, -0.75, 0.6, 0.4, { fill: C.green, stroke: C.ink, 'stroke-width': 0.6 }) + R(8.0, -0.75, 0.6, 0.4, { fill: C.green, stroke: C.ink, 'stroke-width': 0.6 });
    g += R(2.4, -1.0, 0.7, 0.14, { fill: C.ink });
    g += Tx(2.75, -1.45, 'ป้ายเมนูเช้า', { 'font-size': 11, fill: C.graph });
    g += Tx(6.6, -2.0, 'จุดรอคิว · ซื้อกลับบ้าน', { 'font-size': 12, fill: C.graph });
    g += Tx(2.2, 4.8, 'โถงที่นั่ง 52.1 ม²', { 'font-size': 12.5 }) + Tx(5.4, 4.8, '36 ที่นั่ง', { ...mono, 'font-size': 11, fill: C.seal });
    return g;
  }

  function nightFurniture() {
    let g = '';
    SY.lanterns.forEach(([x, y, r]) => { g += O(x, y, r * 0.75, { fill: C.lantern, 'fill-opacity': 0.28, stroke: C.seal, 'stroke-width': 0.7, 'stroke-dasharray': '3 2' }); });
    SY.nightTables.concat(SY.outTables).forEach(([x, y]) => { g += R(x - 0.4, y - 0.4, 0.8, 0.8, { fill: C.wood, stroke: C.ink, 'stroke-width': 0.8 }); });
    SY.nightStools.forEach(([x, y]) => { g += O(x, y, 0.15, { fill: C.cushion, stroke: C.ink, 'stroke-width': 0.7 }); });
    SY.cartsNight.forEach(([x, y, w, d]) => {
      g += R(x, y, w, d, { fill: '#DCE4E6', stroke: C.ink, 'stroke-width': 0.9 });
      for (let i = 1; i < 5; i++) g += L(x + 0.1, y + i * d / 5, x + w - 0.1, y + i * d / 5, { stroke: C.seal, 'stroke-width': 1 });
    });
    g += R(0.05, 1.0, 0.7, 3.2, { fill: C.seal, 'fill-opacity': 0.08, stroke: C.seal, 'stroke-width': 1 });
    SY.screens.forEach(([x1, y1, x2]) => {
      g += R(x1, y1 - 0.03, x2 - x1, 0.06, { fill: C.wood, stroke: C.ink, 'stroke-width': 0.6 });
      for (let x = x1 + 0.2; x < x2; x += 0.2) g += L(x, y1 - 0.09, x, y1 + 0.09, { stroke: C.ink, 'stroke-width': 0.5 });
    });
    SY.facadeLanterns.forEach(([x, y]) => { g += O(x, y, 0.22, { fill: C.lantern, 'fill-opacity': 0.5, stroke: C.seal, 'stroke-width': 0.8 }); });
    g += L(8.55, -0.3, 8.55, -0.3, {}) + R(8.47, -0.42, 0.16, 0.16, { fill: C.indigo });
    g += Tx(1.3, 0.5, 'บาร์หมาล่า 串串', { 'font-size': 12, fill: C.seal, 'text-anchor': 'start' });
    g += Tx(3.9, 4.25, 'โถงโรงเตี๊ยม', { 'font-size': 12.5 }) + Tx(3.9, 3.95, '32 + 16 ที่นั่ง', { ...mono, 'font-size': 11, fill: C.seal });
    g += Tx(3.6, 5.62, 'ฉากไม้ฉลุ 窗花', { 'font-size': 11, fill: C.graph });
    g += Tx(4.45, -2.85, 'ลานโต๊ะริมทางยามค่ำ', { 'font-size': 12, fill: C.graph });
    return g;
  }

  function markers() {
    let g = '';
    const y = 4.6;
    g += L(-1.05, y, -0.9, y, { stroke: C.ink, 'stroke-width': 2 }) + L(W + 0.2, y, W + 0.35, y, { stroke: C.ink, 'stroke-width': 2 });
    [[-1.3, 'A'], [W + 1.55, 'A']].forEach(([x, t]) => {
      g += el('polygon', { points: `${X(x) - 10},${Y(y) - 8} ${X(x) + 10},${Y(y) - 8} ${X(x)},${Y(y) - 22}`, fill: C.ink });
      g += bubble(X(x), Y(y), t, 11);
    });
    g += el('polygon', { points: `${X(col.x) - 10},${Y(-4.35) - 4} ${X(col.x) + 10},${Y(-4.35) - 4} ${X(col.x)},${Y(-4.35) - 18}`, fill: C.ink }) + bubble(X(col.x), Y(-4.35) + 8, '1', 11);
    return g;
  }

  function scaleNorth() {
    let g = '';
    const y = -4.85;
    [0, 1, 2, 3].forEach(i => { g += R(-1.2 + i, y, 1, 0.1, { fill: i % 2 ? C.sheet : C.ink, stroke: C.ink, 'stroke-width': 0.6 }); });
    [[0, '0'], [1, '1'], [2, '2'], [4, '4 ม.']].forEach(([m, t]) => { g += el('text', { x: X(-1.2 + m), y: Y(y) + 16, 'text-anchor': 'middle', ...mono, 'font-size': 10.5 }, t); });
    g += el('text', { x: X(-1.2), y: Y(y) - 8, ...mono, 'font-size': 10.5, fill: C.graph }, 'มาตราส่วน 1:100');
    const nx = X(W + 0.5), ny = Y(-4.7);
    g += el('circle', { cx: nx, cy: ny, r: 17, ...thin }) + el('polygon', { points: `${nx},${ny - 17} ${nx + 7},${ny + 9} ${nx},${ny + 4} ${nx - 7},${ny + 9}`, fill: C.ink });
    g += el('text', { x: nx, y: ny - 22, 'text-anchor': 'middle', ...mono, 'font-size': 12 }, 'N');
    g += el('text', { x: nx, y: ny + 32, 'text-anchor': 'middle', ...mono, 'font-size': 9.5, fill: C.graph }, 'รอยืนยันทิศ');
    return g;
  }

  function keynote(x, y, n) {
    const cx = X(x), cy = Y(y);
    return el('polygon', { points: `${cx},${cy - 11} ${cx + 11},${cy} ${cx},${cy + 11} ${cx - 11},${cy}`, fill: C.seal }) +
      el('text', { x: cx, y: cy + 4.2, 'text-anchor': 'middle', ...mono, 'font-size': 11.5, fill: '#FBF3E6' }, n);
  }
  const KEYS = [[2.0, 0.45, 1], [4.9, 5.5, 2], [0.45, 8.45, 3], [3.05, 9.35, 4], [8.45, 3.0, 5], [2.0, 6.3, 6], [4.45, -2.2, 7], [5.4, 2.5, 8], [0.4, 6.4, 9]];

  function existing() {
    let g = '';
    [[1.8, 2.6], [1.8, 6.2], [4.45, 2.6], [4.45, 7.4], [7.1, 2.6], [7.1, 6.2]].forEach(([x, y]) => { g += R(x - 0.6, y - 0.05, 1.2, 0.1, { ...dash, stroke: C.graph }); });
    [[1.0, 1.6, 1.4, 1.1], [3.5, 2.0, 2.4, 1.5], [5.2, 6.1, 1.6, 1.1], [1.2, 4.2, 1.6, 0.9]].forEach(([x, y, w, h]) => { g += R(x, y, w, h, { fill: 'url(#hatch)', opacity: 0.55, stroke: 'none' }); });
    g += R(-0.08, 6.1, 0.16, 0.45, { fill: C.seal });
    g += R(W, 1.2, 0.15, 7.6, { fill: 'none', stroke: C.seal, 'stroke-width': 1.4, 'stroke-dasharray': '4 3' });
    KEYS.forEach(([x, y, n]) => { g += keynote(x, y, n); });
    g += dimH([0, W], D + 0.45, ['8.82 (วัดจริง)'], C.seal);
    g += dimV([0, D], -0.55, ['9.99 (วัดจริง)'], C.seal);
    g += dimH([0, W], -0.55, ['8.92 (วัดจริง)'], C.seal);
    g += Tx(4.45, 5.95, 'เสา Y สูง 3.07 (วัดจริง)', { ...mono, 'font-size': 11, fill: C.seal });
    return g;
  }

  function rcp() {
    let g = partitionsAndBOH(false).replace(/<text[^>]*>[^<]*<\/text>/g, '');
    SY.dayLights.forEach(([x1, y1, x2, y2], i) => {
      g += L(x1, y1, x2, y2, { stroke: i === 2 ? C.graph : C.ink, 'stroke-width': 5, 'stroke-linecap': 'butt' });
      g += el('text', { x: X(x1) + 10, y: Y(y2) + 4, ...mono, 'font-size': 11.5, fill: C.ink }, i === 2 ? 'C3' : 'C1');
    });
    SY.lanterns.forEach(([x, y, r]) => { g += O(x, y, r * 0.6, { fill: C.lantern, stroke: C.seal, 'stroke-width': 1 }) + O(x, y, r * 0.15, { fill: C.seal }); });
    SY.facadeLanterns.forEach(([x, y]) => { g += O(x, y, 0.2, { fill: C.lantern, stroke: C.seal, 'stroke-width': 1 }); });
    SY.nightTables.slice(0, 3).forEach(([x, y]) => { g += el('text', { x: X(x) + 16, y: Y(y) - 12, ...mono, 'font-size': 11, fill: C.seal }, 'C2'); });
    g += R(7.95, 3.25, 0.93, 3.7, { ...dash, 'stroke-width': 1 }) + L(7.95, 3.25, 8.88, 6.95, { ...dash, 'stroke-width': 0.5 }) + L(7.95, 6.95, 8.88, 3.25, { ...dash, 'stroke-width': 0.5 });
    [4.1, 6.1].forEach(y => {
      g += L(8.4, y, W + 0.55, y, { stroke: C.seal, 'stroke-width': 1.2 });
      g += el('polygon', { points: `${X(W + 0.55)},${Y(y) - 5} ${X(W + 0.55) + 9},${Y(y)} ${X(W + 0.55)},${Y(y) + 5}`, fill: C.seal });
    });
    g += Tx(8.4, 7.25, 'ท่อดูดควัน → ช่องระแนงเดิม', { 'font-size': 11, fill: C.seal });
    g += R(6.1, 0.55, 0.36, 0.36, { fill: C.sheet, stroke: C.ink, 'stroke-width': 1.2 }) + Tx(6.28, 0.64, 'S', { ...mono, 'font-size': 11 });
    g += Tx(5.0, 0.2, 'แผงสวิตช์ฉาก เช้า / ค่ำ', { 'font-size': 11, fill: C.graph });
    return g;
  }

  return function (mode) {
    const night = mode === 'night';
    let body = grid() + shell();
    if (mode === 'existing') body += existing();
    else if (mode === 'rcp') body += rcp();
    else {
      body += partitionsAndBOH(night) + kitchen(night) + (night ? nightFurniture() : dayFurniture()) + markers();
      body += dimH([0, W], D + 0.45) + dimV([0, 7.9, D], -0.45) + dimV([0, D], -0.8) + dimV([0, 1.4, 7.0, D], W + 0.45) + dimH([0, 3.95, 4.95, W], -0.55, ['3.95', '1.00', '3.95']);
    }
    body += scaleNorth();
    const id = `hatch-${mode}`;
    const defs = el('defs', {}, el('pattern', { id, width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      el('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: C.graph, 'stroke-width': 0.7 })));
    body = body.replace(/url\(#hatch\)/g, `url(#${id})`);
    return `<svg viewBox="0 0 ${f(VBW)} ${f(VBH)}" role="img" aria-label="ผังพื้นโหมด ${mode}">${defs}${body}</svg>`;
  };
})();
