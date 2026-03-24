// ============================================================
//  PATHFINDER — AI Planning Agent
//  Algorithms: BFS, UCS, Dijkstra, A*, Greedy Best-First, DFS
// ============================================================

const COLS = 14;
const ROWS = 12;

let grid = [];        // 0=empty, 1=wall, 2=weighted
let start = { x: 0, y: Math.floor(ROWS / 2) };
let goal  = { x: COLS - 1, y: Math.floor(ROWS / 2) };
let currentTool = 'wall';
let isRunning = false;
let animationTimeouts = [];
let isDragging = false;

// ============================================================
//  GRID INIT
// ============================================================
function initGrid() {
  grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function drawGrid(path = [], visited = []) {
  const gridEl = document.getElementById('grid');
  gridEl.innerHTML = '';

  const visitedSet = new Set(visited.map(p => key(p)));
  const pathSet    = new Set(path.map(p => key(p)));

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.x = x;
      cell.dataset.y = y;

      const k = `${x},${y}`;

      if (grid[y][x] === 1) cell.classList.add('wall');
      else if (grid[y][x] === 2) cell.classList.add('weighted');

      if (visitedSet.has(k)) cell.classList.add('visited');
      if (pathSet.has(k))    cell.classList.add('path');
      if (x === start.x && y === start.y) cell.classList.add('agent');
      if (x === goal.x  && y === goal.y)  cell.classList.add('goal');

      // Events
      cell.addEventListener('mousedown',  e => { isDragging = true; handleCellInteraction(x, y); e.preventDefault(); });
      cell.addEventListener('mouseenter', () => { if (isDragging) handleCellInteraction(x, y); });
      cell.addEventListener('mouseup',    () => { isDragging = false; });

      gridEl.appendChild(cell);
    }
  }
}

document.addEventListener('mouseup', () => { isDragging = false; });

// ============================================================
//  CELL INTERACTION
// ============================================================
function setTool(t) {
  currentTool = t;
  document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tool-' + t).classList.add('active');
}

function handleCellInteraction(x, y) {
  if (isRunning) return;

  if (currentTool === 'start') {
    if (grid[y][x] === 1 || (x === goal.x && y === goal.y)) return;
    start = { x, y };
    drawGrid();
    return;
  }
  if (currentTool === 'goal') {
    if (grid[y][x] === 1 || (x === start.x && y === start.y)) return;
    goal = { x, y };
    drawGrid();
    return;
  }
  if (x === start.x && y === start.y) return;
  if (x === goal.x  && y === goal.y)  return;

  if (currentTool === 'wall') {
    grid[y][x] = grid[y][x] === 1 ? 0 : 1;
  } else if (currentTool === 'weight') {
    grid[y][x] = grid[y][x] === 2 ? 0 : 2;
  }

  const cellEl = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
  if (cellEl) {
    cellEl.classList.remove('wall', 'weighted', 'visited', 'path');
    if (grid[y][x] === 1) { cellEl.classList.add('wall'); cellEl.classList.add('wall-anim'); }
    if (grid[y][x] === 2)   cellEl.classList.add('weighted');
  }
}

// ============================================================
//  HELPERS
// ============================================================
function key(n) { return `${n.x},${n.y}`; }

function getNeighbors(node) {
  const moves = [[0,1],[1,0],[0,-1],[-1,0]];
  return moves
    .map(([dx, dy]) => ({ x: node.x + dx, y: node.y + dy }))
    .filter(n => n.x >= 0 && n.y >= 0 && n.x < COLS && n.y < ROWS && grid[n.y][n.x] !== 1);
}

function moveCost(n) {
  return grid[n.y][n.x] === 2 ? 3 : 1;
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstruct(parent, end) {
  const path = [];
  let curr = key(end);
  while (parent[curr] !== null && parent[curr] !== undefined) {
    const [x, y] = curr.split(',').map(Number);
    path.push({ x, y });
    curr = parent[curr];
  }
  return path.reverse();
}

function calcPathCost(path) {
  return path.reduce((acc, n) => acc + moveCost(n), 0);
}

// ============================================================
//  ALGORITHMS
// ============================================================

// --- BFS ---
function BFS() {
  const queue = [start];
  const visited = new Set([key(start)]);
  const parent = { [key(start)]: null };
  const visitOrder = [];

  while (queue.length) {
    const curr = queue.shift();
    visitOrder.push(curr);

    if (curr.x === goal.x && curr.y === goal.y)
      return { path: reconstruct(parent, curr), visited: visitOrder };

    for (const next of getNeighbors(curr)) {
      if (!visited.has(key(next))) {
        visited.add(key(next));
        parent[key(next)] = key(curr);
        queue.push(next);
      }
    }
  }
  return { path: [], visited: visitOrder };
}

// --- DFS ---
function DFS() {
  const stack = [start];
  const visited = new Set([key(start)]);
  const parent = { [key(start)]: null };
  const visitOrder = [];

  while (stack.length) {
    const curr = stack.pop();
    visitOrder.push(curr);

    if (curr.x === goal.x && curr.y === goal.y)
      return { path: reconstruct(parent, curr), visited: visitOrder };

    for (const next of getNeighbors(curr)) {
      if (!visited.has(key(next))) {
        visited.add(key(next));
        parent[key(next)] = key(curr);
        stack.push(next);
      }
    }
  }
  return { path: [], visited: visitOrder };
}

// --- UCS (same as Dijkstra with unit costs) ---
function UCS() {
  return _dijkstra(false);
}

// --- Dijkstra (respects weighted cells) ---
function Dijkstra() {
  return _dijkstra(true);
}

function _dijkstra(useWeights) {
  const pq = [{ node: start, cost: 0 }];
  const visited = new Set();
  const parent = { [key(start)]: null };
  const costMap = { [key(start)]: 0 };
  const visitOrder = [];

  while (pq.length) {
    pq.sort((a, b) => a.cost - b.cost);
    const { node, cost } = pq.shift();

    if (visited.has(key(node))) continue;
    visited.add(key(node));
    visitOrder.push(node);

    if (node.x === goal.x && node.y === goal.y)
      return { path: reconstruct(parent, node), visited: visitOrder };

    for (const next of getNeighbors(node)) {
      const step = useWeights ? moveCost(next) : 1;
      const newCost = cost + step;
      if (!(key(next) in costMap) || newCost < costMap[key(next)]) {
        costMap[key(next)] = newCost;
        parent[key(next)] = key(node);
        pq.push({ node: next, cost: newCost });
      }
    }
  }
  return { path: [], visited: visitOrder };
}

// --- A* ---
function AStar() {
  const pq = [{ node: start, g: 0, f: heuristic(start, goal) }];
  const parent = { [key(start)]: null };
  const gCost = { [key(start)]: 0 };
  const visited = new Set();
  const visitOrder = [];

  while (pq.length) {
    pq.sort((a, b) => a.f - b.f);
    const { node, g } = pq.shift();

    if (visited.has(key(node))) continue;
    visited.add(key(node));
    visitOrder.push(node);

    if (node.x === goal.x && node.y === goal.y)
      return { path: reconstruct(parent, node), visited: visitOrder };

    for (const next of getNeighbors(node)) {
      const newG = g + moveCost(next);
      if (!(key(next) in gCost) || newG < gCost[key(next)]) {
        gCost[key(next)] = newG;
        parent[key(next)] = key(node);
        pq.push({ node: next, g: newG, f: newG + heuristic(next, goal) });
      }
    }
  }
  return { path: [], visited: visitOrder };
}

// --- Greedy Best-First ---
function Greedy() {
  const pq = [{ node: start, h: heuristic(start, goal) }];
  const visited = new Set([key(start)]);
  const parent = { [key(start)]: null };
  const visitOrder = [];

  while (pq.length) {
    pq.sort((a, b) => a.h - b.h);
    const { node } = pq.shift();
    visitOrder.push(node);

    if (node.x === goal.x && node.y === goal.y)
      return { path: reconstruct(parent, node), visited: visitOrder };

    for (const next of getNeighbors(node)) {
      if (!visited.has(key(next))) {
        visited.add(key(next));
        parent[key(next)] = key(node);
        pq.push({ node: next, h: heuristic(next, goal) });
      }
    }
  }
  return { path: [], visited: visitOrder };
}

// ============================================================
//  ANIMATION
// ============================================================
function getAnimDelay() {
  const speed = parseInt(document.getElementById('speed').value);
  // speed 1→slow(80ms), speed 5→fast(5ms)
  return [80, 40, 20, 10, 5][speed - 1];
}

function animateSearch(visitOrder, path, totalCost) {
  const delay = getAnimDelay();
  animationTimeouts = [];
  isRunning = true;

  document.querySelector('.btn-run').classList.add('running');
  document.querySelector('.btn-run').innerHTML = '<span class="btn-icon">⏳</span> RUNNING';

  setStatus('running', `Exploring ${visitOrder.length} nodes…`);

  // Animate visited cells
  visitOrder.forEach((node, i) => {
    if (node.x === start.x && node.y === start.y) return;
    if (node.x === goal.x  && node.y === goal.y)  return;

    const t = setTimeout(() => {
      const cell = document.querySelector(`.cell[data-x="${node.x}"][data-y="${node.y}"]`);
      if (cell && !cell.classList.contains('wall')) cell.classList.add('visited');
    }, i * delay);
    animationTimeouts.push(t);
  });

  const pathStart = visitOrder.length * delay;

  if (path.length === 0) {
    const t = setTimeout(() => {
      setStatus('error', 'No path found — try removing some walls!');
      finishRun(visitOrder.length, 0, 0);
    }, pathStart + 200);
    animationTimeouts.push(t);
    return;
  }

  // Animate path cells
  path.forEach((node, i) => {
    const t = setTimeout(() => {
      const cell = document.querySelector(`.cell[data-x="${node.x}"][data-y="${node.y}"]`);
      if (cell) { cell.classList.remove('visited'); cell.classList.add('path'); }
    }, pathStart + i * (delay * 2 + 10));
    animationTimeouts.push(t);
  });

  const doneTime = pathStart + path.length * (delay * 2 + 10) + 300;
  const t = setTimeout(() => {
    setStatus('success', `Path found! ${path.length} steps, cost ${totalCost}, explored ${visitOrder.length} nodes.`);
    finishRun(visitOrder.length, path.length, totalCost);
  }, doneTime);
  animationTimeouts.push(t);
}

function finishRun(nodes, pathLen, cost) {
  isRunning = false;
  document.querySelector('.btn-run').classList.remove('running');
  document.querySelector('.btn-run').innerHTML = '<span class="btn-icon">▶</span> RUN';
}

// ============================================================
//  STATS
// ============================================================
function updateStats(nodes, pathLen, cost, ms) {
  setStatVal('val-nodes', nodes === null ? '—' : nodes);
  setStatVal('val-path',  pathLen === null ? '—' : pathLen);
  setStatVal('val-cost',  cost === null ? '—' : cost);
  setStatVal('val-time',  ms === null ? '—' : ms);
}

function setStatVal(id, val) {
  const el = document.getElementById(id);
  el.textContent = val;
  const card = el.closest('.stat-card');
  card.classList.add('updated');
  setTimeout(() => card.classList.remove('updated'), 600);
}

function setStatus(type, msg) {
  const bar = document.getElementById('status-bar');
  bar.className = type;
  document.getElementById('status-text').textContent = msg;
  const icons = { success: '✓', error: '✗', running: '◈', '': '◈' };
  document.getElementById('status-icon').textContent = icons[type] || '◈';
}

// ============================================================
//  RUN
// ============================================================
function run() {
  if (isRunning) return;
  clearTimeouts();
  clearPath();

  const algo = document.querySelector('input[name="algo"]:checked').value;
  const t0 = performance.now();
  let result;

  switch (algo) {
    case 'bfs':      result = BFS();      break;
    case 'ucs':      result = UCS();      break;
    case 'dijkstra': result = Dijkstra(); break;
    case 'astar':    result = AStar();    break;
    case 'greedy':   result = Greedy();   break;
    case 'dfs':      result = DFS();      break;
    default:         result = AStar();
  }

  const ms = (performance.now() - t0).toFixed(2);
  const cost = result.path.length ? calcPathCost(result.path) : 0;

  updateStats(result.visited.length, result.path.length || 0, cost || '—', ms);
  animateSearch(result.visited, result.path, cost);
}

// ============================================================
//  CLEAR / RESET
// ============================================================
function clearTimeouts() {
  animationTimeouts.forEach(clearTimeout);
  animationTimeouts = [];
  isRunning = false;
  document.querySelector('.btn-run').classList.remove('running');
  document.querySelector('.btn-run').innerHTML = '<span class="btn-icon">▶</span> RUN';
}

function clearPath() {
  clearTimeouts();
  document.querySelectorAll('.cell.visited, .cell.path').forEach(c => {
    c.classList.remove('visited', 'path');
  });
  setStatus('', 'Ready — Select an algorithm and click RUN');
  updateStats(null, null, null, null);
}

function resetGrid() {
  clearTimeouts();
  start = { x: 0, y: Math.floor(ROWS / 2) };
  goal  = { x: COLS - 1, y: Math.floor(ROWS / 2) };
  initGrid();
  drawGrid();
  setStatus('', 'Grid reset — Ready');
  updateStats(null, null, null, null);
}

// ============================================================
//  PRESETS
// ============================================================
function loadPreset(name) {
  clearTimeouts();
  initGrid();

  if (name === 'maze') {
    start = { x: 0, y: 0 };
    goal  = { x: COLS-1, y: ROWS-1 };
    // Horizontal walls with gaps
    for (let x = 0; x < COLS - 2; x++) grid[2][x] = 1;
    for (let x = 2; x < COLS;     x++) grid[4][x] = 1;
    for (let x = 0; x < COLS - 2; x++) grid[6][x] = 1;
    for (let x = 2; x < COLS;     x++) grid[8][x] = 1;
    for (let x = 0; x < COLS - 2; x++) grid[10][x] = 1;
  }

  else if (name === 'diagonal') {
    start = { x: 0, y: 0 };
    goal  = { x: COLS-1, y: ROWS-1 };
    for (let i = 1; i < ROWS - 1; i++) {
      const x = Math.min(Math.floor(i * COLS / ROWS) + 2, COLS - 1);
      if (x < COLS) grid[i][x] = 1;
    }
    // Add some weights
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++)
        if (grid[y][x] === 0 && (x + y) % 5 === 0) grid[y][x] = 2;
  }

  else if (name === 'spiral') {
    start = { x: 0, y: 0 };
    goal  = { x: 7, y: 6 };
    // Outer walls
    for (let x = 2; x < 12; x++) grid[2][x] = 1;
    for (let y = 2; y < 10; y++) grid[y][11] = 1;
    for (let x = 3; x < 12; x++) grid[10][x] = 1;
    for (let y = 2; y < 10; y++) grid[y][2]  = 1;
    // Inner walls
    for (let x = 4; x < 10; x++) grid[4][x] = 1;
    for (let y = 4; y < 8;  y++) grid[y][9]  = 1;
    for (let x = 5; x < 10; x++) grid[8][x] = 1;
    for (let y = 4; y < 8;  y++) grid[y][4]  = 1;
    grid[2][2] = 0; grid[10][2] = 0;
  }

  else if (name === 'random') {
    start = { x: 0, y: Math.floor(ROWS / 2) };
    goal  = { x: COLS-1, y: Math.floor(ROWS / 2) };
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if ((x === start.x && y === start.y) || (x === goal.x && y === goal.y)) continue;
        const r = Math.random();
        if (r < 0.25)       grid[y][x] = 1;
        else if (r < 0.38)  grid[y][x] = 2;
      }
    }
  }

  drawGrid();
  setStatus('', `Preset "${name}" loaded — Ready`);
  updateStats(null, null, null, null);
}

// ============================================================
//  ALGO CARD CLICK HANDLER
// ============================================================
document.querySelectorAll('.algo-opt').forEach(label => {
  label.addEventListener('click', () => {
    if (!isRunning) clearPath();
  });
});

// ============================================================
//  INIT
// ============================================================
initGrid();
// Default: a horizontal wall with a gap
for (let x = 0; x < COLS - 3; x++) grid[Math.floor(ROWS/2) - 2][x + 1] = 1;
for (let x = 2; x < COLS - 1; x++) grid[Math.floor(ROWS/2) + 2][x]     = 1;
drawGrid();
setStatus('', 'Ready — Select an algorithm and click RUN');