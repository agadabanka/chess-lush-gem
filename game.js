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
const state = {"score":0,"level":1,"gameOver":false,"currentTurn":"white","whiteInCheck":false,"blackInCheck":false,"moveCount":0,"selectedPiece":null,"validMoves":[]};

// ECS Component types
// Component "Position" { x: int, y: int }
// Component "ChessPiece" { type: enum, color: enum, hasMoved: bool, displayChar: string }
// Component "Selected" {  }
// Component "Cursor" { color: color }
// Component "Board" { grid: grid }
// Component "ValidMove" { fromX: int, fromY: int, toX: int, toY: int }

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
  world.addComponent(eid, "Board", {});
  return eid;
}

// Systems (execution order)
// [0] spawn (type: spawn)
//     entities: [{"archetype":"whiteRook","position":[0,7]},{"archetype":"whiteKnight","position":[1,7]},{"archetype":"whiteBishop","position":[2,7]},{"archetype":"whiteQueen","position":[3,7]},{"archetype":"whiteKing","position":[4,7]},{"archetype":"whiteBishop","position":[5,7]},{"archetype":"whiteKnight","position":[6,7]},{"archetype":"whiteRook","position":[7,7]},{"archetype":"whitePawn","position":[0,6]},{"archetype":"whitePawn","position":[1,6]},{"archetype":"whitePawn","position":[2,6]},{"archetype":"whitePawn","position":[3,6]},{"archetype":"whitePawn","position":[4,6]},{"archetype":"whitePawn","position":[5,6]},{"archetype":"whitePawn","position":[6,6]},{"archetype":"whitePawn","position":[7,6]},{"archetype":"blackRook","position":[0,0]},{"archetype":"blackKnight","position":[1,0]},{"archetype":"blackBishop","position":[2,0]},{"archetype":"blackQueen","position":[3,0]},{"archetype":"blackKing","position":[4,0]},{"archetype":"blackBishop","position":[5,0]},{"archetype":"blackKnight","position":[6,0]},{"archetype":"blackRook","position":[7,0]},{"archetype":"blackPawn","position":[0,1]},{"archetype":"blackPawn","position":[1,1]},{"archetype":"blackPawn","position":[2,1]},{"archetype":"blackPawn","position":[3,1]},{"archetype":"blackPawn","position":[4,1]},{"archetype":"blackPawn","position":[5,1]},{"archetype":"blackPawn","position":[6,1]},{"archetype":"blackPawn","position":[7,1]},{"archetype":"cursor"},{"archetype":"board"}]
// [1] input (type: input)
//     target: "cursor"
//     actions: {"up":{"move":[0,-1]},"down":{"move":[0,1]},"left":{"move":[-1,0]},"right":{"move":[1,0]},"select":{"emit":"pieceSelect"}}
// [2] wrap (type: wrap)
//     target: "cursor"
// [3] chessLogic (type: custom)
//     selectPiece: true
//     validateMoves: true
//     handleCaptures: true
//     turnBased: true
//     listens: "pieceSelect"
// [4] scoring (type: scoring)
//     resource: "state"
//     captureScores: {"pawn":1,"knight":3,"bishop":3,"rook":5,"queen":9,"king":1000}
// [5] gameOver (type: gameOver)
//     condition: "state.gameOver"
// [6] render (type: render)
//     layers: [{"source":"board","type":"chessBoard","lightSquares":"#f0d9b5","darkSquares":"#b58863"},{"source":"ChessPiece","type":"piece"},{"source":"cursor","type":"highlight"},{"source":"Selected","type":"highlight","color":"#0f0"},{"source":"ValidMove","type":"highlight","color":"#00f"},{"source":"state","type":"hud","fields":["currentTurn","moveCount"]}]

// Game rules
// on "pieceCaptured" => { increment: {"state.score":"event.value"} }
// on "moveMade" => { increment: {"state.moveCount":1}, set: {"state.currentTurn":"event.nextTurn"} }
// on "pieceSelected" => { set: {"state.selectedPiece":"event.pieceId"} }
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