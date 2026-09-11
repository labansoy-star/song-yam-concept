// Shared building model (metres). x = across frontage from left wall, y = depth from shutter line, z = height.
const SY = (() => {
  const W = 8.9, D = 10.0, EAVE = 3.07, RIDGE = 4.3, T = 0.15;
  const C = {
    ink:'#1C1B19', graph:'#6B6862', hair:'#CFCBC2', seal:'#B3261E', wash:'#F0E2C2', wash2:'#E4D3AE',
    sheet:'#FBFAF7', night:'#161923', night2:'#232838', lantern:'#E9A23B', indigo:'#2F3552',
    steel:'#2A2A2A', wood:'#7A5236', woodL:'#A7774E', ss:'#C9CCCF', cushion:'#8E2E24', concrete:'#CDBFA6',
    wall:'#EFE4CC', green:'#6E8455'
  };
  const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`).join(' ');
  const el = (t, o = {}, inner) => inner === undefined ? `<${t} ${attrs(o)}/>` : `<${t} ${attrs(o)}>${inner}</${t}>`;

  const front = { shutters: [[0.15, 3.95], [4.95, 8.75]], door: [3.95, 4.95], shutterHead: 2.6 };
  const backDoor = [2.6, 3.5];
  const win = [7.95, 8.95];
  const col = { x: 4.45, y: 5.0 };
  const canopy = { y0: -3.6, posts: [0, 4.45, 8.9] };

  const rooms = [
    { id: 'DN', name: 'โถงที่นั่ง', cjk: '堂食区', x: 0, y: 0, w: 6.6, h: 7.9 },
    { id: 'K', name: 'เคาน์เตอร์โชว์', cjk: '早点档', x: 6.6, y: 1.4, w: 2.3, h: 5.6 },
    { id: 'P', name: 'ครัวเตรียม·ล้าง', x: 6.6, y: 7.0, w: 2.3, h: 3.0 },
    { id: 'S', name: 'คลัง·จอดรถเข็น', x: 3.6, y: 7.9, w: 3.0, h: 2.1 },
    { id: 'C', name: 'ทางพนักงาน', x: 1.8, y: 7.9, w: 1.8, h: 2.1 },
    { id: 'WC', name: 'ห้องน้ำ', x: 0, y: 7.9, w: 1.8, h: 2.1 }
  ];
  // new partitions [x1,y1,x2,y2]; openings are gaps between segments
  const partitions = [
    [0, 7.9, 0.5, 7.9], [1.3, 7.9, 2.2, 7.9], [3.1, 7.9, 4.6, 7.9], [5.5, 7.9, 6.6, 7.9],
    [1.8, 7.9, 1.8, 10], [3.6, 7.9, 3.6, 10], [6.6, 7.9, 6.6, 8.4], [6.6, 9.2, 6.6, 10]
  ];
  const stations = [
    { k: 'SM', name: 'น้ำเต้าหู้', cjk: '豆浆', y0: 1.4, y1: 3.2 },
    { k: 'YT', name: 'ปาท่องโก๋', cjk: '油条', y0: 3.2, y1: 5.0, hood: true },
    { k: 'MX', name: 'หมี่เซี่ยน', cjk: '米线', y0: 5.0, y1: 7.0, hood: true }
  ];

  // Day: communal tables along x, 3 stools per long side
  const dayTables = [1.3, 3.45, 5.6].flatMap(y => [[0.9, y, 2.2, 0.8], [3.6, y, 2.2, 0.8]]);
  const dayStools = dayTables.flatMap(([x, y, w, d]) => [0.37, 1.1, 1.83].flatMap(o => [[x + o, y - 0.27], [x + o, y + d + 0.27]]));
  // Night: 4-top tables with low stools
  const nightTables = [[2.1, 2.3], [3.9, 2.3], [5.6, 2.3], [2.1, 4.3], [5.6, 4.3], [2.1, 6.5], [3.9, 6.5], [5.6, 6.5]];
  const outTables = [[1.5, -1.8], [3.0, -1.8], [5.9, -1.8], [7.4, -1.8]];
  const ring = ([cx, cy]) => [[cx - 0.62, cy], [cx + 0.62, cy], [cx, cy - 0.62], [cx, cy + 0.62]];
  const nightStools = nightTables.concat(outTables).flatMap(ring);
  const cartsNight = [[0.05, 1.0, 0.7, 1.5], [0.05, 2.7, 0.7, 1.5]];
  const cartsDay = [[3.85, 8.2, 1.5, 0.7], [3.85, 9.1, 1.5, 0.7]];
  const screens = [[0.9, 5.4, 2.9, 5.4], [4.9, 5.4, 6.3, 5.4]];
  const lanterns = nightTables.map(([x, y]) => [x, y, 0.36]).concat([[col.x, col.y + 0.55, 0.5]]);
  const facadeLanterns = [[3.55, -0.25], [5.35, -0.25]];
  const dayLights = [[2.0, 0.9, 2.0, 7.4], [4.95, 0.9, 4.95, 7.4], [7.75, 1.6, 7.75, 6.8]];

  const seats = { day: dayStools.length, night: nightTables.length * 4, out: outTables.length * 4 };
  return {
    W, D, EAVE, RIDGE, T, C, el, front, backDoor, win, col, canopy, rooms, partitions, stations,
    dayTables, dayStools, nightTables, outTables, nightStools, cartsNight, cartsDay, screens,
    lanterns, facadeLanterns, dayLights, seats
  };
})();
