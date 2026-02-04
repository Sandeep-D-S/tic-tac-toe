
const cells = Array.from(document.querySelectorAll('.cell'));
const boardWrap = document.querySelector('.board-wrap');
const boardEl = document.querySelector('.board');
const statusEl = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const undoBtn = document.getElementById('undo-btn');
const historyList = document.getElementById('history-list');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreD = document.getElementById('score-d');
const resetScoresBtn = document.getElementById('reset-scores');
const aiSettings = document.getElementById('ai-settings');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const diffRadios = document.querySelectorAll('input[name="difficulty"]');

// Game state
let board = Array(9).fill(null);
let turn = 'X';
let over = false;
let history = [];
let scores = { X: 0, O: 0, D: 0 };

// Config
let mode = 'ai';
let difficulty = 'medium';

// Winning lines
const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// --- UI helpers: SVG win line and confetti canvas --- //
let svgOverlay = null;
let confettiCanvas = null;
let confettiCtx = null;
let confettiParticles = [];
let confettiAnimId = null;

function ensureOverlays(){
  if(!svgOverlay){
    svgOverlay = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgOverlay.setAttribute('class','win-line');
    svgOverlay.setAttribute('aria-hidden','true');
    svgOverlay.style.position = 'absolute';
    svgOverlay.style.left = 0;
    svgOverlay.style.top = 0;
    svgOverlay.style.width = '100%';
    svgOverlay.style.height = '100%';
    boardWrap.appendChild(svgOverlay);
  }
  if(!confettiCanvas){
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.className = 'confetti-canvas';
    confettiCanvas.width = boardWrap.clientWidth;
    confettiCanvas.height = boardWrap.clientHeight;
    boardWrap.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext('2d');
    window.addEventListener('resize', () => {
      if(confettiCanvas){
        confettiCanvas.width = boardWrap.clientWidth;
        confettiCanvas.height = boardWrap.clientHeight;
      }
    });
  }
}

function clearWinLine(){
  if(svgOverlay) svgOverlay.innerHTML = '';
}

function drawWinLine(line){
  ensureOverlays();
  clearWinLine();

  // Compute center positions for cells relative to boardWrap
  const rect = boardWrap.getBoundingClientRect();
  const a = cellCenter(line[0], rect);
  const b = cellCenter(line[2], rect);
  // create a <line> or <path> with nice stroke
  const svgns = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(svgns, 'path');

  // Slightly extend ends for aesthetic
  const extend = 8;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = a.x - ux * extend;
  const sy = a.y - uy * extend;
  const ex = b.x + ux * extend;
  const ey = b.y + uy * extend;

  const d = `M ${sx} ${sy} L ${ex} ${ey}`;
  path.setAttribute('d', d);
  path.setAttribute('stroke', 'rgba(16,185,129,0.95)');
  path.setAttribute('stroke-width', Math.max(6, boardWrap.clientWidth * 0.012));
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-dasharray', '0'); // will animate
  path.style.filter = 'drop-shadow(0 6px 18px rgba(16,185,129,0.12))';

  svgOverlay.appendChild(path);

  // Animate the stroke dash to create drawing effect
  const totalLen = path.getTotalLength();
  path.style.strokeDasharray = totalLen;
  path.style.strokeDashoffset = totalLen;
  path.getBoundingClientRect(); // force layout
  path.style.transition = 'stroke-dashoffset 520ms cubic-bezier(.2,.9,.3,1)';
  requestAnimationFrame(() => {
    path.style.strokeDashoffset = '0';
  });
}

// compute center point (x,y) relative to boardWrap coordinates
function cellCenter(index, parentRect){
  const cellEl = cells[index];
  const r = cellEl.getBoundingClientRect();
  return { x: r.left + r.width/2 - parentRect.left, y: r.top + r.height/2 - parentRect.top };
}

// --- Confetti implementation --- //
function launchConfetti(){
  ensureOverlays();
  confettiParticles = [];
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  const count = Math.max(24, Math.floor((w*h)/20000)); // scale with area

  for(let i=0;i<count;i++){
    confettiParticles.push({
      x: Math.random()*w,
      y: Math.random()*h*0.2 + h*0.05, // start near top
      vx: (Math.random()-0.5)*2.4,
      vy: Math.random()*2 + 2,
      size: (Math.random()*6)+6,
      color: randomColor(),
      rotation: Math.random()*360,
      vr: (Math.random()-0.5)*8
    });
  }
  if(confettiAnimId) cancelAnimationFrame(confettiAnimId);
  confettiAnimId = requestAnimationFrame(confettiLoop);
  // stop after 2.8s
  setTimeout(() => {
    if(confettiAnimId) cancelAnimationFrame(confettiAnimId);
    fadeOutConfetti();
  }, 2800);
}

function confettiLoop(){
  const ctx = confettiCtx;
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  ctx.clearRect(0,0,w,h);
  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.rotation += p.vr;
    // draw rectangle with rotation
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI/180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
    ctx.restore();
  });
  // remove offscreen
  confettiParticles = confettiParticles.filter(p => p.y < h + 40);
  confettiAnimId = requestAnimationFrame(confettiLoop);
}

function fadeOutConfetti(){
  if(!confettiCanvas || !confettiCtx) return;
  let alpha = 1;
  const ctx = confettiCtx;
  const w = confettiCanvas.width;
  const h = confettiCanvas.height;
  const fadeStep = 0.06;

  const fade = () => {
    alpha -= fadeStep;
    if(alpha <= 0){
      ctx.clearRect(0,0,w,h);
      if(confettiAnimId) cancelAnimationFrame(confettiAnimId);
      confettiParticles = [];
      return;
    }
    ctx.clearRect(0,0,w,h);
    ctx.globalAlpha = alpha;
    confettiParticles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(fade);
  };
  requestAnimationFrame(fade);
}

function randomColor(){
  const palette = ['#ef4444','#f97316','#f59e0b','#84cc16','#10b981','#06b6d4','#3b82f6','#8b5cf6'];
  return palette[Math.floor(Math.random()*palette.length)];
}

/* ---------- Game core (continuation / integration) ---------- */

// Utility helpers
const sleep = ms => new Promise(r => setTimeout(r, ms));
const emptyIndices = (bd) => bd.map((v,i) => v ? null : i).filter(v => v!==null);

// Render functions (reused / integrated)
function renderBoard(){
  cells.forEach((cell,i)=>{
    cell.classList.remove('x','o','played','win');
    const val = board[i];
    if(val){
      cell.textContent = val;
      cell.classList.add(val === 'X' ? 'x' : 'o','played');
      cell.setAttribute('aria-pressed', 'true');
    } else {
      cell.textContent = '';
      cell.setAttribute('aria-pressed', 'false');
    }
  });
  renderHistory();
  renderScores();
  updateStatus();
}

function updateStatus(msg){
  if(msg) statusEl.textContent = msg;
  else if(over) statusEl.textContent = 'Game over';
  else statusEl.textContent = `Turn: ${turn}`;
}

// History UI
function pushHistory(idx, player){
  history.push({ idx, player });
  renderHistory();
}
function popHistory(){
  const mv = history.pop();
  renderHistory();
  return mv;
}
function renderHistory(){
  historyList.innerHTML = '';
  history.forEach((h, i) => {
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${h.player} → Cell ${h.idx+1}`;
    historyList.appendChild(li);
  });
}

// Score UI
function renderScores(){
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreD.textContent = scores.D;
}

// Game mechanics and Minimax (adapted for O as AI)
function checkWinner(bd){
  for(const [a,b,c] of wins){
    if(bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return { winner: bd[a], line: [a,b,c] };
  }
  if(bd.every(Boolean)) return { winner: 'draw' };
  return null;
}

function highlightLine(line){
  line.forEach(i => {
    const c = cells[i];
    c.classList.add('win');
  });
}

function endGame(result){
  over = true;
  if(result.winner === 'draw'){
    updateStatus('Draw!');
    scores.D += 1;
  } else {
    updateStatus(`Winner: ${result.winner}`);
    scores[result.winner] += 1;
    highlightLine(result.line);
    // draw animated SVG win line + confetti
    drawWinLine(result.line);
    launchConfetti();
  }
  persistScores();
}

// Make a move at index (returns true if move applied)
function makeMove(idx){
  if(over || board[idx]) return false;
  board[idx] = turn;
  pushHistory(idx, turn);
  renderBoard();
  const result = checkWinner(board);
  if(result){
    // delay a touch so animations render
    setTimeout(()=> endGame(result), 80);
    return true;
  }
  // swap turn
  turn = turn === 'X' ? 'O' : 'X';
  updateStatus();
  return true;
}

// Undo last move (and if AI mode, undo one more to restore human turn)
function undo(){
  if(history.length === 0 || over) return;
  const last = popHistory();
  board[last.idx] = null;
  // If mode is AI and last move was AI, also undo player's move
  if(mode === 'ai' && last.player === 'O' && history.length > 0){
    const prev = popHistory();
    board[prev.idx] = null;
    turn = prev.player;
  } else {
    turn = last.player === 'X' ? 'O' : 'X';
  }
  over = false;
  clearWinLine();
  cells.forEach(c => c.classList.remove('win'));
  renderBoard();
}

// Restart the game but keep scores
function restart(){
  board = Array(9).fill(null);
  history = [];
  turn = 'X';
  over = false;
  clearWinLine();
  cells.forEach(c => c.classList.remove('win'));
  renderBoard();
  updateStatus('New game — Turn: X');
}

// Reset scores to zero
function resetScores(){
  scores = { X: 0, O: 0, D: 0 };
  renderScores();
  persistScores();
}

// Minimax AI implementation (O is AI minimizing)
function minimax(bd, player){
  const result = checkWinner(bd);
  if(result){
    if(result.winner === 'draw') return { score: 0 };
    return { score: result.winner === 'X' ? 10 : -10 };
  }

  const avail = emptyIndices(bd);
  const moves = [];

  for(const idx of avail){
    const copy = bd.slice();
    copy[idx] = player;
    const res = minimax(copy, player === 'X' ? 'O' : 'X');
    moves.push({ idx, score: res.score });
  }

  if(player === 'X'){
    // maximizer
    let best = moves[0];
    for(const m of moves) if(m.score > best.score) best = m;
    return best;
  } else {
    // minimizer
    let best = moves[0];
    for(const m of moves) if(m.score < best.score) best = m;
    return best;
  }
}

// Get AI move
function getAIMove(){
  const avail = emptyIndices(board);
  if(avail.length === 0) return null;

  if(difficulty === 'easy'){
    return avail[Math.floor(Math.random() * avail.length)];
  } else if(difficulty === 'medium'){
    if(Math.random() < 0.5){
      return avail[Math.floor(Math.random() * avail.length)];
    } else {
      const best = minimax(board, 'O');
      return best.idx;
    }
  } else {
    const best = minimax(board, 'O');
    return best.idx;
  }
}

// AI turn with slight delay
async function aiTurn(){
  if(over) return;
  await sleep(260);
  const move = getAIMove();
  if(move !== null && move !== undefined){
    makeMove(move);
  }
}

/* ---------- Event wiring ---------- */

cells.forEach((cell, i) => {
  cell.addEventListener('click', async () => {
    if(over) return;
    if(mode === 'ai' && turn === 'O') return; // wait for AI
    if(makeMove(i)){
      if(mode === 'ai' && !over && turn === 'O'){
        await aiTurn();
      }
    }
  });

  cell.addEventListener('keydown', async (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      if(over) return;
      if(mode === 'ai' && turn === 'O') return;
      if(makeMove(i)){
        if(mode === 'ai' && !over && turn === 'O'){
          await aiTurn();
        }
      }
    }
  });
});

// Controls
undoBtn.addEventListener('click', undo);
restartBtn.addEventListener('click', restart);
resetScoresBtn.addEventListener('click', resetScores);

// Mode and difficulty listeners
modeRadios.forEach(r => r.addEventListener('change', (e) => {
  mode = e.target.value;
  aiSettings.style.display = mode === 'ai' ? 'block' : 'none';
  restart();
}));
diffRadios.forEach(d => d.addEventListener('change', (e) => {
  difficulty = e.target.value;
  restart();
}));

// Persist scores to localStorage
function persistScores(){
  try { localStorage.setItem('ttt-scores', JSON.stringify(scores)); } catch(e){}
}
function loadScores(){
  try {
    const s = JSON.parse(localStorage.getItem('ttt-scores'));
    if(s && typeof s === 'object') scores = Object.assign(scores, s);
  } catch(e){}
}

/* ---------- Initialization ---------- */
function init(){
  ensureOverlays();
  if(mode === 'human') aiSettings.style.display = 'none';
  else aiSettings.style.display = 'block';
  loadScores();
  renderScores();
  renderBoard();
  cells.forEach(c => c.setAttribute('tabindex','0'));
  // responsive canvas sizing
  if(confettiCanvas){
    confettiCanvas.width = boardWrap.clientWidth;
    confettiCanvas.height = boardWrap.clientHeight;
  }
}

window.addEventListener('beforeunload', persistScores);
window.addEventListener('resize', () => {
  if(confettiCanvas){
    confettiCanvas.width = boardWrap.clientWidth;
    confettiCanvas.height = boardWrap.clientHeight;
    clearWinLine();
  }
});

init();