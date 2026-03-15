// Chess v1.0.0
// Classic chess game with piece movement and capture mechanics

const GRID_WIDTH  = 8;
const GRID_HEIGHT = 8;
const CELL_SIZE   = 60;
const BG_COLOR    = "#f0d9b5";

// Timing
let tickRate = 1000;  // ms

// Input mapping
const INPUT_MAP = {
  "select": [" ", "Enter"],
  "up": ["ArrowUp", "w"],
  "down": ["ArrowDown", "s"],
  "left": ["ArrowLeft", "a"],
  "right": ["ArrowRight", "d"],
  "restart": ["r", "R"],
};

// Game state (resources)
const state = {"score":0,"level":1,"gameOver":false,"currentTurn":"white","whiteInCheck":false,"blackInCheck":false,"moveCount":0};

// ECS Component types
// Component "Position" { x: int, y: int }
// Component "ChessPiece" { type: enum, color: enum, hasMoved: bool, displayChar: string }
// Component "Selected" {  }
// Component "Cursor" { color: color }
// Component "Board" { grid: grid }

// Entity archetypes
function createwhitePawn(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":0,"y":6});
  world.addComponent(eid, "ChessPiece", {"type":"pawn","color":"white","displayChar":"♙"});
  return eid;
}
function createblackPawn(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":0,"y":1});
  world.addComponent(eid, "ChessPiece", {"type":"pawn","color":"black","displayChar":"♟"});
  return eid;
}
function createwhiteRook(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":0,"y":7});
  world.addComponent(eid, "ChessPiece", {"type":"rook","color":"white","displayChar":"♖"});
  return eid;
}
function createblackRook(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":0,"y":0});
  world.addComponent(eid, "ChessPiece", {"type":"rook","color":"black","displayChar":"♜"});
  return eid;
}
function createwhiteKnight(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":1,"y":7});
  world.addComponent(eid, "ChessPiece", {"type":"knight","color":"white","displayChar":"♘"});
  return eid;
}
function createblackKnight(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":1,"y":0});
  world.addComponent(eid, "ChessPiece", {"type":"knight","color":"black","displayChar":"♞"});
  return eid;
}
function createwhiteBishop(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":2,"y":7});
  world.addComponent(eid, "ChessPiece", {"type":"bishop","color":"white","displayChar":"♗"});
  return eid;
}
function createblackBishop(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":2,"y":0});
  world.addComponent(eid, "ChessPiece", {"type":"bishop","color":"black","displayChar":"♝"});
  return eid;
}
function createwhiteQueen(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":3,"y":7});
  world.addComponent(eid, "ChessPiece", {"type":"queen","color":"white","displayChar":"♕"});
  return eid;
}
function createblackQueen(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":3,"y":0});
  world.addComponent(eid, "ChessPiece", {"type":"queen","color":"black","displayChar":"♛"});
  return eid;
}
function createwhiteKing(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":4,"y":7});
  world.addComponent(eid, "ChessPiece", {"type":"king","color":"white","displayChar":"♔"});
  return eid;
}
function createblackKing(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":4,"y":0});
  world.addComponent(eid, "ChessPiece", {"type":"king","color":"black","displayChar":"♚"});
  return eid;
}
function createcursor(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Position", {"x":4,"y":4});
  world.addComponent(eid, "Cursor", {"color":"#ff0"});
  return eid;
}
function createboard(world) {
  const eid = world.createEntity();
  world.addComponent(eid, "Board", {"grid":{"cols":8,"rows":8,"cells":[]}});
  return eid;
}

// Systems (execution order)
// [0] spawn (type: custom)
//     code: "function spawnChessPieces(world) { const pieces = [{ archetype: 'whiteRook', x: 0, y: 7 }, { archetype: 'whiteKnight', x: 1, y: 7 }, { archetype: 'whiteBishop', x: 2, y: 7 }, { archetype: 'whiteQueen', x: 3, y: 7 }, { archetype: 'whiteKing', x: 4, y: 7 }, { archetype: 'whiteBishop', x: 5, y: 7 }, { archetype: 'whiteKnight', x: 6, y: 7 }, { archetype: 'whiteRook', x: 7, y: 7 }, { archetype: 'whitePawn', x: 0, y: 6 }, { archetype: 'whitePawn', x: 1, y: 6 }, { archetype: 'whitePawn', x: 2, y: 6 }, { archetype: 'whitePawn', x: 3, y: 6 }, { archetype: 'whitePawn', x: 4, y: 6 }, { archetype: 'whitePawn', x: 5, y: 6 }, { archetype: 'whitePawn', x: 6, y: 6 }, { archetype: 'whitePawn', x: 7, y: 6 }, { archetype: 'blackRook', x: 0, y: 0 }, { archetype: 'blackKnight', x: 1, y: 0 }, { archetype: 'blackBishop', x: 2, y: 0 }, { archetype: 'blackQueen', x: 3, y: 0 }, { archetype: 'blackKing', x: 4, y: 0 }, { archetype: 'blackBishop', x: 5, y: 0 }, { archetype: 'blackKnight', x: 6, y: 0 }, { archetype: 'blackRook', x: 7, y: 0 }, { archetype: 'blackPawn', x: 0, y: 1 }, { archetype: 'blackPawn', x: 1, y: 1 }, { archetype: 'blackPawn', x: 2, y: 1 }, { archetype: 'blackPawn', x: 3, y: 1 }, { archetype: 'blackPawn', x: 4, y: 1 }, { archetype: 'blackPawn', x: 5, y: 1 }, { archetype: 'blackPawn', x: 6, y: 1 }, { archetype: 'blackPawn', x: 7, y: 1 }, { archetype: 'cursor', x: 4, y: 4 }, { archetype: 'board', x: 0, y: 0 }]; pieces.forEach(piece => { const eid = world.createEntity(); if (piece.archetype === 'cursor') { world.addComponent(eid, 'Position', { x: piece.x, y: piece.y }); world.addComponent(eid, 'Cursor', { color: '#ff0' }); } else if (piece.archetype === 'board') { world.addComponent(eid, 'Board', { grid: { cols: 8, rows: 8, cells: [] } }); } else { world.addComponent(eid, 'Position', { x: piece.x, y: piece.y }); const pieceType = piece.archetype.replace('white', '').replace('black', '').toLowerCase(); const color = piece.archetype.includes('white') ? 'white' : 'black'; const chars = { white: { pawn: '♙', rook: '♖', knight: '♘', bishop: '♗', queen: '♕', king: '♔' }, black: { pawn: '♟', rook: '♜', knight: '♞', bishop: '♝', queen: '♛', king: '♚' } }; world.addComponent(eid, 'ChessPiece', { type: pieceType, color: color, hasMoved: false, displayChar: chars[color][pieceType] }); } }); }"
// [1] input (type: input)
//     target: "cursor"
//     actions: {"up":{"move":[0,-1]},"down":{"move":[0,1]},"left":{"move":[-1,0]},"right":{"move":[1,0]},"select":{"action":"selectOrMove"}}
// [2] wrap (type: wrap)
//     target: "cursor"
// [3] collision (type: collision)
//     chessRules: true
//     turnBased: true
// [4] scoring (type: scoring)
//     resource: "state"
//     captureScores: {"pawn":1,"knight":3,"bishop":3,"rook":5,"queen":9,"king":1000}
// [5] gameOver (type: gameOver)
//     condition: "state.gameOver"
// [6] render (type: render)
//     layers: [{"source":"board","type":"chessBoard","lightSquares":"#f0d9b5","darkSquares":"#b58863"},{"source":"ChessPiece","type":"piece"},{"source":"cursor","type":"highlight"},{"source":"Selected","type":"highlight","color":"#0f0"},{"source":"state","type":"hud","fields":["currentTurn","moveCount"]}]

// Game rules
// on "pieceCaptured" => { increment: {"state.score":"event.value"} }
// on "moveMade" => { increment: {"state.moveCount":1}, set: {"state.currentTurn":"event.nextTurn"} }
// when "state.whiteInCheck && state.currentTurn === 'white'" => { action: "checkForCheckmate" }
// when "state.blackInCheck && state.currentTurn === 'black'" => { action: "checkForCheckmate" }
// on "checkmate" => { set: {"state.gameOver":true} }

// Game loop
function gameLoop(world) {
  let last = performance.now();
  function loop(now) {
    world.tick(now - last);
    last = now;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}