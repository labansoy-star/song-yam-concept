// Front elevation and cross-section A-A, day / night palettes
(() => {
  const { W, EAVE, RIDGE, C, el, col } = SY;
  const s = 62, ox = 118;
  const f = n => +n.toFixed(1);
  const pal = night => night
    ? { bg: C.night, line: '#E6DFD0', soft: '#8E889A', wall: '#2A2533', part: '#352E3F', inner: '#6B3222', inner2: '#8A4526', shutter: '#262B42', slat: '#3B415E', person: '#0E0F14', metal: '#2B2F3D', poche: '#07080B', text: '#E6DFD0', lanternBody: C.lantern }
    : { bg: 'none', line: C.ink, soft: C.graph, wall: C.wall, part: '#E6D8B9', inner: '#F2E3C1', inner2: '#E9D2A4', shutter: C.indigo, slat: '#4A5274', person: '#8F8A82', metal: '#DAD8D1', poche: C.ink, text: C.ink, lanternBody: '#C4463A' };

  function kit(base) {
    const X = x => f(ox + x * s), Z = z => f(base - z * s);
    const R = (x, z, w, h, o = {}) => el('rect', { x: X(x), y: Z(z + h), width: f(w * s), height: f(h * s), ...o });
    const L = (x1, z1, x2, z2, o = {}) => el('line', { x1: X(x1), y1: Z(z1), x2: X(x2), y2: Z(z2), ...o });
    const P = (pts, o = {}) => el('polygon', { points: pts.map(([x, z]) => `${X(x)},${Z(z)}`).join(' '), ...o });
    const E = (x, z, rx, rz, o = {}) => el('ellipse', { cx: X(x), cy: Z(z), rx: f(rx * s), ry: f(rz * s), ...o });
    const T = (x, z, t, o = {}) => el('text', { x: X(x), y: Z(z), 'font-family': 'IBM Plex Sans Thai, sans-serif', 'font-size': 11.5, ...o }, t);
    return { X, Z, R, L, P, E, T };
  }

  function person(k, p, x, h, pose, face = 1) {
    const { R, P, E } = k, o = { fill: p.person };
    if (pose === 'sit') {
      return P([[x - 0.17, 0.45], [x + 0.17, 0.45], [x + 0.18, 1.02], [x - 0.18, 1.02]], o) + E(x, 1.17, 0.11, 0.12, o) +
        R(Math.min(x, x + face * 0.42), 0.42, 0.42, 0.14, o) + R(x + face * 0.42 - 0.06, 0, 0.12, 0.56, o);
    }
    return E(x, h - 0.12, 0.11, 0.12, o) + P([[x - 0.19, h - 0.27], [x + 0.19, h - 0.27], [x + 0.15, h * 0.5], [x - 0.15, h * 0.5]], o) +
      R(x - 0.14, 0, 0.12, h * 0.5, o) + R(x + 0.02, 0, 0.12, h * 0.5, o);
  }

  function lantern(k, p, x, zb, night, big = 1) {
    const { L, E, R } = k;
    const rx = 0.19 * big, rz = 0.23 * big, zc = zb + rz + 0.06;
    let g = '';
    if (night) g += E(x, zc, rx * 3, rz * 2.6, { fill: C.lantern, 'fill-opacity': 0.16 }) + E(x, zc, rx * 1.8, rz * 1.6, { fill: C.lantern, 'fill-opacity': 0.2 });
    g += E(x, zc, rx, rz, { fill: night ? C.lantern : p.lanternBody, stroke: night ? C.seal : p.line, 'stroke-width': 1 });
    if (night) g += E(x, zc, rx * 0.55, rz * 0.8, { fill: '#FFE2A8' });
    g += R(x - rx * 0.5, zc + rz - 0.02, rx, 0.05, { fill: p.line }) + R(x - rx * 0.5, zc - rz - 0.03, rx, 0.05, { fill: p.line });
    g += L(x, zc - rz - 0.03, x, zb - 0.14, { stroke: C.seal, 'stroke-width': 1.5 });
    return g;
  }

  function levels(k, p, x, list) {
    const { X, Z } = k;
    return list.map(([z, t]) => {
      const px = X(x), py = Z(z);
      return el('polygon', { points: `${px - 6},${py - 9} ${px + 6},${py - 9} ${px},${py}`, fill: 'none', stroke: p.line, 'stroke-width': 1 }) +
        el('line', { x1: px - 10, y1: py, x2: X(0) - 12, y2: py, stroke: p.soft, 'stroke-width': 0.5, 'stroke-dasharray': '2 3' }) +
        el('text', { x: px - 12, y: py - 2, 'text-anchor': 'end', 'font-family': 'IBM Plex Mono, monospace', 'font-size': 11, fill: p.text }, t);
    }).join('');
  }

  function dims(k, p, xs, z, labels) {
    const { X, Z, L } = k;
    let g = L(xs[0] - 0.15, z, xs[xs.length - 1] + 0.15, z, { stroke: p.line, 'stroke-width': 0.6 });
    xs.forEach(x => { g += el('line', { x1: X(x) - 4, y1: Z(z) + 4, x2: X(x) + 4, y2: Z(z) - 4, stroke: p.line, 'stroke-width': 1.3 }) + L(x, z - 0.12, x, z + 0.12, { stroke: p.line, 'stroke-width': 0.6 }); });
    for (let i = 0; i < xs.length - 1; i++) g += el('text', { x: X((xs[i] + xs[i + 1]) / 2), y: Z(z) - 5, 'text-anchor': 'middle', 'font-family': 'IBM Plex Mono, monospace', 'font-size': 11.5, fill: p.text }, labels[i]);
    return g;
  }

  const roofZ = x => EAVE + (RIDGE - EAVE) * (1 - Math.abs(x - col.x) / (W / 2 + 0.15));

  SY.drawElevation = mode => {
    const night = mode === 'night', p = pal(night), base = 338, k = kit(base), { X, Z, R, L, P, E, T } = k;
    const VBW = f(ox + (W + 1.4) * s), VBH = base + 62;
    let g = night ? el('rect', { x: 0, y: 0, width: VBW, height: VBH, fill: p.bg }) : '';
    g += P([[-0.15, EAVE], [col.x, RIDGE], [W + 0.15, EAVE]], { fill: p.metal, stroke: p.line, 'stroke-width': 1 });
    for (let x = 0.05; x < W + 0.1; x += 0.22) g += L(x, EAVE, x, roofZ(x) - 0.02, { stroke: p.soft, 'stroke-width': 0.5 });
    g += L(-0.3, EAVE - 0.06, col.x, RIDGE + 0.04, { stroke: p.line, 'stroke-width': 3 }) + L(col.x, RIDGE + 0.04, W + 0.3, EAVE - 0.06, { stroke: p.line, 'stroke-width': 3 });
    g += R(-0.15, 2.72, W + 0.3, EAVE - 2.72, { fill: p.wall, stroke: p.line, 'stroke-width': 0.8 });
    for (let x = 0; x < W + 0.1; x += 0.12) g += L(x, 2.74, x, EAVE - 0.02, { stroke: p.soft, 'stroke-width': 0.6 });
    const bays = [[0.15, 3.8], [5.1, 8.75]];
    bays.forEach(([a, b]) => {
      g += R(a, 0, b - a, 2.6, { fill: p.inner });
      if (night) g += R(a, 0, b - a, 0.9, { fill: p.inner2 });
    });
    g += R(3.95, 0, 1.0, 2.3, { fill: p.inner }) + (night ? R(3.95, 0, 1.0, 0.9, { fill: p.inner2 }) : '');
    // interior glimpses
    const tableC = night ? p.person : C.woodL;
    [[0.9, 3.1], [5.3, 6.4]].forEach(([a, b]) => { g += R(a, 0.72, b - a, 0.06, { fill: tableC }) + R(a + 0.08, 0, 0.05, 0.72, { fill: tableC }) + R(b - 0.13, 0, 0.05, 0.72, { fill: tableC }); });
    g += R(6.6, 0, 2.15, 1.05, { fill: night ? p.person : C.woodL, stroke: night ? 'none' : p.line, 'stroke-width': 0.6 });
    g += person(k, p, 1.5, 1.6, 'sit', 1) + person(k, p, 2.6, 1.6, 'sit', -1) + person(k, p, 5.8, 1.62, 'stand') + person(k, p, 7.7, 1.7, 'stand');
    if (!night) g += person(k, p, 4.45, 1.66, 'stand');
    // shutters
    bays.forEach(([a, b]) => {
      const bottom = night ? 1.25 : 2.38;
      g += R(a, bottom, b - a, 2.6 - bottom, { fill: p.shutter, stroke: p.line, 'stroke-width': 0.8 });
      for (let z = bottom + 0.08; z < 2.6; z += 0.08) g += L(a, z, b, z, { stroke: p.slat, 'stroke-width': 0.7 });
      if (night) for (let x = a + 0.35; x < b - 0.3; x += 0.28) g += R(x, 2.12, 0.16, 0.05, { fill: '#F5B25A' });
    });
    [[-0.15, 0.15], [3.8, 3.95], [4.95, 5.1], [8.75, W + 0.15]].forEach(([a, b]) => { g += R(a, 0, b - a, 2.72, { fill: C.steel, stroke: p.line, 'stroke-width': 0.5 }); });
    g += R(-0.15, 2.6, W + 0.3, 0.12, { fill: C.steel });
    g += R(3.95, 2.3, 1.0, 0.3, { fill: 'none', stroke: p.line, 'stroke-width': 0.8 });
    for (let x = 4.05; x < 4.95; x += 0.1) g += L(x, 2.3, x, 2.6, { stroke: p.line, 'stroke-width': 0.6 });
    // signboard
    g += R(2.55, 2.74, 3.8, 0.66, { fill: '#3A2518', stroke: p.line, 'stroke-width': 1 });
    g += el('text', { x: X(4.2), y: Z(2.98), 'text-anchor': 'middle', 'font-family': 'Noto Serif SC, serif', 'font-weight': 700, 'font-size': 23, 'letter-spacing': 6, fill: '#E7C27A' }, '晨昏客栈');
    g += el('text', { x: X(4.2), y: Z(2.8), 'text-anchor': 'middle', 'font-family': 'Bai Jamjuree, sans-serif', 'font-size': 9.5, 'letter-spacing': 2, fill: '#E7C27A' }, 'โรงเตี๊ยมสองยาม');
    g += R(5.72, 2.86, 0.44, 0.44, { fill: C.seal }) + el('text', { x: X(5.94), y: Z(3.02), 'text-anchor': 'middle', 'font-family': 'Noto Serif SC, serif', 'font-weight': 700, 'font-size': 11, fill: '#FBF3E6' }, '早夜');
    SY.facadeLanterns.forEach(([x]) => { g += L(x, 2.6, x, 2.5, { stroke: p.line, 'stroke-width': 1 }) + lantern(k, p, x, 1.95, night); });
    // banner 幌子
    g += L(8.5, 0, 8.5, 3.55, { stroke: C.steel, 'stroke-width': 3 }) + L(8.5, 3.5, 9.25, 3.5, { stroke: C.steel, 'stroke-width': 2.5 });
    g += R(8.62, 1.55, 0.55, 1.9, { fill: C.indigo, stroke: p.line, 'stroke-width': 0.8 });
    g += P([[8.62, 1.55], [8.895, 1.38], [9.17, 1.55]], { fill: C.indigo });
    [['豆', 3.12], ['浆', 2.78], ['串', 2.3], ['串', 1.96]].forEach(([c, z]) => { g += el('text', { x: X(8.895), y: Z(z), 'text-anchor': 'middle', 'font-family': 'Noto Serif SC, serif', 'font-weight': 700, 'font-size': 17, fill: '#F1E6D0' }, c); });
    g += E(8.895, 2.55, 0.035, 0.035, { fill: C.seal });
    // planters
    [[0.3, 0.9], [7.75, 8.3]].forEach(([a, b]) => {
      g += P([[a, 0], [b, 0], [b + 0.05, 0.45], [a - 0.05, 0.45]], { fill: '#8A6B52', stroke: p.line, 'stroke-width': 0.8 });
      const m = (a + b) / 2;
      g += E(m - 0.15, 0.75, 0.25, 0.3, { fill: night ? '#2F3A2A' : C.green }) + E(m + 0.18, 0.85, 0.22, 0.34, { fill: night ? '#3A4833' : '#809A63' }) + E(m, 1.05, 0.2, 0.28, { fill: night ? '#34402E' : '#6E8A55' });
    });
    g += L(-1.1, 0, W + 1.2, 0, { stroke: p.line, 'stroke-width': 2.2 });
    for (let x = -1.0; x < W + 1.2; x += 0.3) g += L(x, 0, x - 0.18, -0.18, { stroke: p.soft, 'stroke-width': 0.5 });
    g += levels(k, p, -0.55, [[0, '±0.00'], [2.6, '+2.60'], [EAVE, '+3.07'], [RIDGE, '+4.30*']]);
    g += dims(k, p, [0, 3.95, 4.95, W], -0.55, ['3.95', '1.00', '3.95']);
    g += T(W + 1.3, -0.9, '* ประมาณจากภาพ · กันสาดเดิมด้านหน้าไม่แสดง', { 'text-anchor': 'end', 'font-size': 10.5, fill: p.soft });
    return `<svg viewBox="0 0 ${VBW} ${VBH}" role="img" aria-label="รูปด้านหน้าร้าน โหมด${night ? 'ค่ำ' : 'เช้า'}">${g}</svg>`;
  };

  SY.drawSection = mode => {
    const night = mode === 'night', p = pal(night), base = 338, k = kit(base), { X, Z, R, L, P, E, T } = k;
    const VBW = f(ox + (W + 1.4) * s), VBH = base + 62;
    let g = night ? el('rect', { x: 0, y: 0, width: VBW, height: VBH, fill: p.bg }) : '';
    const under = x => roofZ(x) - 0.12;
    g += P([[0, 0], [0, under(0)], [col.x, under(col.x)], [W, under(W)], [W, 0]], { fill: p.wall });
    g += R(2.6, 0, 0.9, 2.1, { fill: night ? '#12131A' : '#4A3F38' });
    g += P([[0, 0], [0, 2.4], [6.6, 2.4], [6.6, 0], [5.5, 0], [5.5, 2.05], [4.6, 2.05], [4.6, 0], [3.1, 0], [3.1, 2.1], [2.2, 2.1], [2.2, 0], [1.3, 0], [1.3, 2.05], [0.5, 2.05], [0.5, 0]], { fill: p.part, stroke: p.soft, 'stroke-width': 0.6 });
    g += R(col.x - 0.08, 0, 0.16, 3.72, { fill: C.steel });
    g += L(col.x, 3.6, col.x - 0.75, roofZ(col.x - 0.75) - 0.14, { stroke: C.steel, 'stroke-width': 4 }) + L(col.x, 3.6, col.x + 0.75, roofZ(col.x + 0.75) - 0.14, { stroke: C.steel, 'stroke-width': 4 });
    g += L(-0.45, roofZ(-0.45), col.x, RIDGE, { stroke: p.line, 'stroke-width': 4 }) + L(col.x, RIDGE, W + 0.45, roofZ(W + 0.45), { stroke: p.line, 'stroke-width': 4 });
    g += L(0, under(0), col.x, under(col.x), { stroke: p.line, 'stroke-width': 1 }) + L(col.x, under(col.x), W, under(W), { stroke: p.line, 'stroke-width': 1 });
    for (let x = 0.5; x < W; x += 0.85) g += R(x - 0.05, roofZ(x) - 0.12, 0.1, 0.1, { fill: p.line });
    [[-0.15], [W]].forEach(([x]) => {
      g += R(x, 0, 0.15, 2.3, { fill: p.poche });
      g += R(x, 2.3, 0.15, EAVE - 2.3, { fill: 'none', stroke: p.line, 'stroke-width': 0.8 });
      for (let z = 2.42; z < EAVE; z += 0.13) g += L(x, z, x + 0.15, z - 0.05, { stroke: p.line, 'stroke-width': 0.8 });
    });
    g += R(-0.15, -0.18, W + 0.3, 0.18, { fill: p.poche });
    // kitchen
    g += R(6.6, 0, 0.6, 1.05, { fill: C.woodL, stroke: p.line, 'stroke-width': 0.8 }) + L(6.9, 1.05, 6.9, 1.45, { stroke: p.soft, 'stroke-width': 2 }) + L(6.7, 1.45, 7.1, 1.45, { stroke: p.soft, 'stroke-width': 1 });
    g += R(8.25, 0, 0.65, 0.9, { fill: C.ss, stroke: p.line, 'stroke-width': 0.8 }) + R(8.37, 0.9, 0.4, 0.38, { fill: '#B9BDC1', stroke: p.line, 'stroke-width': 0.6 });
    g += P([[7.95, 2.05], [W, 2.05], [W, 2.5], [8.15, 2.5]], { fill: C.ss, stroke: p.line, 'stroke-width': 0.8 });
    g += R(8.45, 2.5, 0.25, 0.3, { fill: C.ss, stroke: p.line, 'stroke-width': 0.6 }) + R(8.45, 2.62, W + 0.55 - 8.45, 0.18, { fill: C.ss, stroke: p.line, 'stroke-width': 0.6 });
    g += P([[W + 0.55, 2.56], [W + 0.8, 2.71], [W + 0.55, 2.86]], { fill: C.seal });
    g += person(k, p, 7.7, 1.68, 'stand');
    // lighting
    if (!night) [[2.0], [4.95]].forEach(([x]) => { g += L(x, under(x), x, 2.95, { stroke: p.soft, 'stroke-width': 0.6 }) + R(x - 0.1, 2.88, 0.2, 0.07, { fill: p.line }); });
    const lx = [[2.1, 1], [3.9, 1], [5.6, 1], [col.x + 0.35, 1.35]];
    lx.forEach(([x, b]) => { g += L(x, under(x), x, 2.4 + 0.52 * b, { stroke: p.soft, 'stroke-width': 0.6 }) + lantern(k, p, x, 2.4, night, b); });
    // furniture & people
    if (!night) {
      [[0.9, 3.1], [3.6, 5.8]].forEach(([a, b]) => { g += R(a, 0.72, b - a, 0.05, { fill: C.woodL, stroke: p.line, 'stroke-width': 0.6 }) + R(a + 0.1, 0, 0.05, 0.72, { fill: p.line }) + R(b - 0.15, 0, 0.05, 0.72, { fill: p.line }); });
      [1.27, 2.0, 2.73, 3.97, 4.7, 5.43].forEach(x => { g += R(x - 0.15, 0.42, 0.3, 0.05, { fill: C.wood }) + R(x - 0.12, 0, 0.03, 0.42, { fill: p.line }) + R(x + 0.09, 0, 0.03, 0.42, { fill: p.line }); });
      g += person(k, p, 1.27, 1.6, 'sit', 1) + person(k, p, 2.73, 1.6, 'sit', -1) + person(k, p, 5.43, 1.6, 'sit', -1) + person(k, p, 6.25, 1.64, 'stand');
      g += T(1.3, 1.9, 'โต๊ะยาวหมู่ +0.75', { fill: p.text }) + T(6.62, 1.6, 'เคาน์เตอร์ +1.05', { fill: p.text });
    } else {
      SY.screens.forEach(([a, , b]) => {
        g += R(a, 0, b - a, 2.0, { fill: 'none', stroke: '#8C6A48', 'stroke-width': 1.4 });
        for (let x = a + 0.2; x < b; x += 0.2) g += L(x, 0.05, x, 1.95, { stroke: '#8C6A48', 'stroke-width': 0.7 });
        for (let z = 0.2; z < 2.0; z += 0.2) g += L(a, z, b, z, { stroke: '#8C6A48', 'stroke-width': 0.7 });
      });
      g += R(0.05, 0, 0.7, 0.92, { fill: C.ss, stroke: p.line, 'stroke-width': 0.8 }) + R(0.05, 0.92, 0.7, 0.32, { fill: '#9FC3CC', 'fill-opacity': 0.45, stroke: p.line, 'stroke-width': 0.8 });
      for (let x = 0.15; x < 0.7; x += 0.1) g += L(x, 0.95, x, 1.18, { stroke: C.seal, 'stroke-width': 1.4 });
      [2.1, 3.9, 5.6].forEach(x => { g += R(x - 0.4, 0.68, 0.8, 0.05, { fill: C.wood, stroke: p.line, 'stroke-width': 0.5 }) + R(x - 0.05, 0, 0.1, 0.68, { fill: C.wood }); });
      [1.48, 2.72, 4.98, 6.22].forEach(x => { g += R(x - 0.16, 0.36, 0.32, 0.08, { fill: C.cushion }) + R(x - 0.1, 0, 0.2, 0.36, { fill: '#5A3A28' }); });
      g += person(k, p, 1.48, 1.6, 'sit', 1) + person(k, p, 2.72, 1.6, 'sit', -1) + person(k, p, 4.98, 1.6, 'sit', 1) + person(k, p, 6.22, 1.6, 'sit', -1) + person(k, p, 1.05, 1.66, 'stand');
      g += T(0.05, 1.45, 'รถเข็นหมาล่า', { fill: p.text }) + T(4.9, 2.1, 'ฉากไม้ฉลุ', { fill: p.text });
    }
    g += T(6.05, 2.02, 'ใต้โคม +2.40', { fill: night ? C.lantern : C.seal, 'font-family': 'IBM Plex Mono, monospace', 'font-size': 10.5 });
    g += T(7.2, 3.02, 'ท่อดูดควัน → ช่องระแนง', { fill: p.text, 'font-size': 10.5 });
    g += L(-1.1, 0, W + 1.1, 0, { stroke: p.line, 'stroke-width': 1.2 });
    g += levels(k, p, -0.55, [[0, '±0.00'], [0.75, '+0.75'], [2.4, '+2.40'], [EAVE, '+3.07'], [RIDGE, '+4.30*']]);
    g += dims(k, p, [0, 6.6, W], -0.55, ['6.60 ที่นั่ง', '2.30 ครัว']);
    return `<svg viewBox="0 0 ${VBW} ${VBH}" role="img" aria-label="รูปตัด A-A โหมด${night ? 'ค่ำ' : 'เช้า'}">${g}</svg>`;
  };
})();
