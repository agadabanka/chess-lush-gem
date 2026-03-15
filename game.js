// Chess v2.0.0
// Classic chess game with full piece movement, capture, castling, and turn-based play

const GRID_WIDTH  = 8;
const GRID_HEIGHT = 8;
const CELL_SIZE   = 60;

// Board Game Config
const BOARD_GAME = {
  "pieceComponent": "ChessPiece",
  "colorField": "color",
  "typeField": "type",
  "forwardDirection": {
    "white": -1,
    "black": 1
  },
  "pawnStartRows": {
    "white": 6,
    "black": 1
  },
  "kingType": "king",
  "rookType": "rook",
  "turnBased": true,
  "turns": [
    "white",
    "black"
  ],
  "moveRules": {
    "pawn": [
      {
        "type": "forward",
        "distance": 1
      },
      {
        "type": "forward",
        "distance": 2,
        "firstMoveOnly": true
      },
      {
        "type": "forwardDiagonal",
        "captureOnly": true
      }
    ],
    "knight": [
      {
        "type": "leap",
        "offsets": [
          [
            1,
            2
          ],
          [
            2,
            1
          ],
          [
            2,
            -1
          ],
          [
            1,
            -2
          ],
          [
            -1,
            -2
          ],
          [
            -2,
            -1
          ],
          [
            -2,
            1
          ],
          [
            -1,
            2
          ]
        ]
      }
    ],
    "bishop": [
      {
        "type": "slide",
        "directions": [
          [
            1,
            1
          ],
          [
            1,
            -1
          ],
          [
            -1,
            1
          ],
          [
            -1,
            -1
          ]
        ]
      }
    ],
    "rook": [
      {
        "type": "slide",
        "directions": [
          [
            1,
            0
          ],
          [
            -1,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            -1
          ]
        ]
      }
    ],
    "queen": [
      {
        "type": "slide",
        "directions": [
          [
            1,
            0
          ],
          [
            -1,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            -1
          ],
          [
            1,
            1
          ],
          [
            1,
            -1
          ],
          [
            -1,
            1
          ],
          [
            -1,
            -1
          ]
        ]
      }
    ],
    "king": [
      {
        "type": "step",
        "directions": [
          [
            1,
            0
          ],
          [
            -1,
            0
          ],
          [
            0,
            1
          ],
          [
            0,
            -1
          ],
          [
            1,
            1
          ],
          [
            1,
            -1
          ],
          [
            -1,
            1
          ],
          [
            -1,
            -1
          ]
        ]
      },
      {
        "type": "castle"
      }
    ]
  },
  "captureRules": {
    "captureOwnPiece": false,
    "kingCaptureMeansGameOver": true,
    "pieceValues": {
      "pawn": 1,
      "knight": 3,
      "bishop": 3,
      "rook": 5,
      "queen": 9,
      "king": 1000
    }
  }
};

// Input mapping
const INPUT_MAP = {
  "up": ["ArrowUp", "w"],
  "down": ["ArrowDown", "s"],
  "left": ["ArrowLeft", "a"],
  "right": ["ArrowRight", "d"],
  "select": [" ", "Enter"],
  "restart": ["r", "R"],
};

// Game state
const state = {"score":0,"level":1,"gameOver":false,"currentTurn":"white","moveCount":0};

// Component types
// Component "Position" { x:int, y:int }
// Component "ChessPiece" { type:enum, color:enum, hasMoved:bool, displayChar:string }
// Component "Selected" {  }
// Component "Cursor" {  }

// Archetypes
// whitePawn: Position, ChessPiece
// blackPawn: Position, ChessPiece
// whiteRook: Position, ChessPiece
// blackRook: Position, ChessPiece
// whiteKnight: Position, ChessPiece
// blackKnight: Position, ChessPiece
// whiteBishop: Position, ChessPiece
// blackBishop: Position, ChessPiece
// whiteQueen: Position, ChessPiece
// blackQueen: Position, ChessPiece
// whiteKing: Position, ChessPiece
// blackKing: Position, ChessPiece
// cursor: Position, Cursor

// Systems
// [spawn] type=spawn
// [input] type=input
// [scoring] type=scoring
// [gameOver] type=gameOver
// [render] type=render

// Compiled by ECS Game Factory generic compiler