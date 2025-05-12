// description: El clásico juego de Tetris con controles táctiles y de teclado
// categories: Arcade, Clásicos, Diversión
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Tetris = () => {
  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    board: [],
    piece: null,
    piecePosition: { x: 0, y: 0 },
    score: 0,
    gameOver: false,
    dropCounter: 0,
    dropInterval: 1000,
    lastTime: 0,
  });

  // Tamaño de cada celda del tablero
  const blockSize = 20;

  // Colores de las piezas
  const colors = [
    null,
    "#FF0D72", // I
    "#0DC2FF", // J
    "#0DFF72", // L
    "#F538FF", // O
    "#FF8E0D", // S
    "#FFE138", // T
    "#3877FF", // Z
  ];

  // Definir las piezas de Tetris
  const pieces = [
    // I
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    // J
    [
      [0, 2, 0],
      [0, 2, 0],
      [2, 2, 0],
    ],
    // L
    [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ],
    // O
    [
      [4, 4],
      [4, 4],
    ],
    // S
    [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ],
    // T
    [
      [0, 0, 0],
      [6, 6, 6],
      [0, 6, 0],
    ],
    // Z
    [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ],
  ];

  // Iniciar una nueva pieza
  const createPiece = () => {
    const pieceType = Math.floor(Math.random() * pieces.length);
    return pieces[pieceType];
  };

  // Dibujar la pieza actual
  const drawPiece = (context) => {
    const { piece, piecePosition } = gameStateRef.current;
    if (!piece) return;

    piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = colors[value];
          context.fillRect(
            (piecePosition.x + x) * blockSize,
            (piecePosition.y + y) * blockSize,
            blockSize,
            blockSize
          );
          context.strokeStyle = "#000";
          context.strokeRect(
            (piecePosition.x + x) * blockSize,
            (piecePosition.y + y) * blockSize,
            blockSize,
            blockSize
          );
        }
      });
    });
  };

  // Dibujar el tablero
  const drawBoard = (context) => {
    const { board } = gameStateRef.current;
    board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = colors[value];
          context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
          context.strokeStyle = "#000";
          context.strokeRect(
            x * blockSize,
            y * blockSize,
            blockSize,
            blockSize
          );
        }
      });
    });
  };

  // Comprobar colisión
  const checkCollision = () => {
    const { piece, piecePosition, board } = gameStateRef.current;
    const boardWidth = canvasRef.current.width / blockSize;
    const boardHeight = canvasRef.current.height / blockSize;

    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x] !== 0) {
          const boardX = piecePosition.x + x;
          const boardY = piecePosition.y + y;

          if (
            boardX < 0 ||
            boardX >= boardWidth ||
            boardY >= boardHeight ||
            (boardY >= 0 && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Mover la pieza
  const movePiece = (dir) => {
    const state = gameStateRef.current;
    state.piecePosition.x += dir;
    if (checkCollision()) {
      state.piecePosition.x -= dir;
    }
  };

  // Rotar la pieza
  const rotatePiece = () => {
    const state = gameStateRef.current;
    const originalPiece = state.piece;
    const rows = state.piece.length;
    const cols = state.piece[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        rotated[x][rows - 1 - y] = state.piece[y][x];
      }
    }

    state.piece = rotated;

    if (checkCollision()) {
      state.piece = originalPiece;
    }
  };

  // Descender la pieza
  const dropPiece = () => {
    const state = gameStateRef.current;
    state.piecePosition.y++;
    if (checkCollision()) {
      state.piecePosition.y--;
      mergePiece();
      removeLines();
      spawnPiece();
    }
  };

  // Fusionar la pieza con el tablero
  const mergePiece = () => {
    const { piece, piecePosition, board } = gameStateRef.current;
    piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const boardX = piecePosition.x + x;
          const boardY = piecePosition.y + y;
          if (boardY >= 0) {
            board[boardY][boardX] = value;
          }
        }
      });
    });
  };

  // Eliminar líneas completas
  const removeLines = () => {
    const state = gameStateRef.current;
    const boardHeight = canvasRef.current.height / blockSize;
    const boardWidth = canvasRef.current.width / blockSize;
    let linesRemoved = 0;

    outer: for (let y = boardHeight - 1; y >= 0; y--) {
      for (let x = 0; x < boardWidth; x++) {
        if (state.board[y][x] === 0) {
          continue outer;
        }
      }

      const row = state.board.splice(y, 1)[0].fill(0);
      state.board.unshift(row);
      y++;
      linesRemoved++;
    }

    if (linesRemoved > 0) {
      state.score += linesRemoved * 100;
      state.dropInterval = Math.max(
        100,
        state.dropInterval - linesRemoved * 20
      );
      updateScore();
    }
  };

  // Actualizar la puntuación
  const updateScore = () => {
    const scoreDisplay = document.getElementById("score-display");
    if (scoreDisplay) {
      scoreDisplay.textContent = `Puntuación: ${gameStateRef.current.score}`;
    }
  };

  // Generar una nueva pieza
  const spawnPiece = () => {
    const state = gameStateRef.current;
    const boardWidth = canvasRef.current.width / blockSize;
    state.piece = createPiece();
    state.piecePosition.x =
      Math.floor(boardWidth / 2) - Math.floor(state.piece[0].length / 2);
    state.piecePosition.y = 0;

    if (checkCollision()) {
      state.gameOver = true;
      const gameOverDisplay = document.getElementById("game-over");
      const finalScoreDisplay = document.getElementById("final-score");
      if (gameOverDisplay && finalScoreDisplay) {
        finalScoreDisplay.textContent = state.score;
        gameOverDisplay.style.display = "block";
      }
    }
  };

  // Reiniciar el juego
  const resetGame = () => {
    const state = gameStateRef.current;
    const boardHeight = canvasRef.current.height / blockSize;
    const boardWidth = canvasRef.current.width / blockSize;
    state.board = Array.from({ length: boardHeight }, () =>
      Array(boardWidth).fill(0)
    );
    state.score = 0;
    updateScore();
    state.dropInterval = 1000;
    state.gameOver = false;
    const gameOverDisplay = document.getElementById("game-over");
    if (gameOverDisplay) {
      gameOverDisplay.style.display = "none";
    }
    spawnPiece();
  };

  // Bucle principal del juego
  const update = (time = 0) => {
    const state = gameStateRef.current;
    if (!state.gameOver && canvasRef.current) {
      const deltaTime = time - state.lastTime;
      state.lastTime = time;

      state.dropCounter += deltaTime;
      if (state.dropCounter > state.dropInterval) {
        dropPiece();
        state.dropCounter = 0;
      }

      const context = canvasRef.current.getContext("2d");
      context.fillStyle = "#000";
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawBoard(context);
      drawPiece(context);
    }

    if (canvasRef.current) {
      state.animationFrameId = requestAnimationFrame(update);
    }
  };

  // Inicializar el juego
  useEffect(() => {
    const canvas = canvasRef.current;
    const boardHeight = canvas.height / blockSize;
    const boardWidth = canvas.width / blockSize;

    gameStateRef.current.board = Array.from({ length: boardHeight }, () =>
      Array(boardWidth).fill(0)
    );
    spawnPiece();
    update();

    // Controles de teclado
    const handleKeyDown = (e) => {
      if (gameStateRef.current.gameOver) return;

      switch (e.key) {
        case "ArrowLeft":
          movePiece(-1);
          break;
        case "ArrowRight":
          movePiece(1);
          break;
        case "ArrowDown":
          dropPiece();
          break;
        case "ArrowUp":
          rotatePiece();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Limpiar cuando el componente se desmonte
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (gameStateRef.current.animationFrameId) {
        cancelAnimationFrame(gameStateRef.current.animationFrameId);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="text-center text-2xl">Tetris</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            id="score-display"
            className="text-center text-xl font-bold mb-4"
          >
            Puntuación: 0
          </div>

          <div
            className="relative mx-auto border-2 border-gray-800 bg-gray-100"
            style={{ width: "240px", height: "400px" }}
          >
            <canvas
              ref={canvasRef}
              width={240}
              height={400}
              className="touch-none"
            />

            <div
              id="game-over"
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white"
              style={{ display: "none" }}
            >
              <div className="text-center p-4">
                <h2 className="text-2xl font-bold mb-2">¡Juego Terminado!</h2>
                <p className="mb-4">
                  Tu puntuación final: <span id="final-score">0</span>
                </p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Jugar de nuevo
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-4">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => movePiece(-1)}
                className="p-4 bg-gray-200 rounded"
              >
                ←
              </button>
              <button
                onClick={() => dropPiece()}
                className="p-4 bg-gray-200 rounded"
              >
                ↓
              </button>
              <button
                onClick={() => movePiece(1)}
                className="p-4 bg-gray-200 rounded"
              >
                →
              </button>
            </div>
            <button
              onClick={() => rotatePiece()}
              className="w-full p-4 bg-gray-200 rounded"
            >
              Rotar ↑
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tetris;
