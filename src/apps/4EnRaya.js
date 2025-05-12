// description: El clásico juego de 4 en Raya con animaciones y efectos visuales
// categories: Estrategia, Clásicos, Multijugador
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ROWS = 6;
const COLS = 7;

const styles = {
  board: {
    backgroundColor: "#0055b3",
    borderRadius: "10px",
    padding: "15px",
    display: "grid",
    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
    gap: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  cell: {
    width: "50px",
    height: "50px",
    backgroundColor: "#f0f0f0",
    borderRadius: "50%",
    margin: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  red: {
    backgroundColor: "#ff4136",
    animation: "drop 0.5s",
  },
  yellow: {
    backgroundColor: "#ffdc00",
    animation: "drop 0.5s",
  },
  columnSelector: {
    width: "100%",
    height: "20px",
    backgroundColor: "transparent",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  columnSelectorHover: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  controls: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#0055b3",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#003d82",
  },
  status: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: "15px 0",
    height: "25px",
  },
  winning: {
    animation: "pulse 1s infinite",
  },
};

const FourInARow = () => {
  const [gameState, setGameState] = useState(
    Array(COLS)
      .fill()
      .map(() => Array(ROWS).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameActive, setGameActive] = useState(true);
  const [lastMove, setLastMove] = useState(null);
  const [winningCells, setWinningCells] = useState([]);

  const makeMove = (col) => {
    if (!gameActive) return;

    const columnArray = [...gameState[col]];
    const rowIndex = columnArray.findIndex((cell) => cell === 0);

    if (rowIndex === -1) return;

    const newGameState = gameState.map((column) => [...column]);
    newGameState[col][rowIndex] = currentPlayer;
    setGameState(newGameState);
    setLastMove({ row: rowIndex, col });

    if (checkWin(newGameState, rowIndex, col)) {
      setGameActive(false);
      setWinningCells(findWinningCells(newGameState, rowIndex, col));
      return;
    }

    if (checkDraw(newGameState)) {
      setGameActive(false);
      return;
    }

    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
  };

  const checkWin = (board, row, col) => {
    const player = board[col][row];
    let count;

    // Check horizontal
    count = 1;
    for (let c = col - 1; c >= 0 && board[c][row] === player; c--) count++;
    for (let c = col + 1; c < COLS && board[c][row] === player; c++) count++;
    if (count >= 4) return true;

    // Check vertical
    count = 1;
    for (let r = row - 1; r >= 0 && board[col][r] === player; r--) count++;
    if (count >= 4) return true;

    // Check diagonal (bottom-left to top-right)
    count = 1;
    for (
      let r = row - 1, c = col - 1;
      r >= 0 && c >= 0 && board[c][r] === player;
      r--, c--
    )
      count++;
    for (
      let r = row + 1, c = col + 1;
      r < ROWS && c < COLS && board[c][r] === player;
      r++, c++
    )
      count++;
    if (count >= 4) return true;

    // Check diagonal (bottom-right to top-left)
    count = 1;
    for (
      let r = row - 1, c = col + 1;
      r >= 0 && c < COLS && board[c][r] === player;
      r--, c++
    )
      count++;
    for (
      let r = row + 1, c = col - 1;
      r < ROWS && c >= 0 && board[c][r] === player;
      r++, c--
    )
      count++;
    if (count >= 4) return true;

    return false;
  };

  const findWinningCells = (board, row, col) => {
    const player = board[col][row];
    const winningCells = [];
    let count, tempWinningCells;

    // Check horizontal
    count = 1;
    tempWinningCells = [{ row, col }];
    for (let c = col - 1; c >= 0 && board[c][row] === player; c--) {
      count++;
      tempWinningCells.push({ row, col: c });
    }
    for (let c = col + 1; c < COLS && board[c][row] === player; c++) {
      count++;
      tempWinningCells.push({ row, col: c });
    }
    if (count >= 4) winningCells.push(...tempWinningCells);

    // Check vertical
    count = 1;
    tempWinningCells = [{ row, col }];
    for (let r = row - 1; r >= 0 && board[col][r] === player; r--) {
      count++;
      tempWinningCells.push({ row: r, col });
    }
    if (count >= 4) winningCells.push(...tempWinningCells);

    // Check diagonal (bottom-left to top-right)
    count = 1;
    tempWinningCells = [{ row, col }];
    for (
      let r = row - 1, c = col - 1;
      r >= 0 && c >= 0 && board[c][r] === player;
      r--, c--
    ) {
      count++;
      tempWinningCells.push({ row: r, col: c });
    }
    for (
      let r = row + 1, c = col + 1;
      r < ROWS && c < COLS && board[c][r] === player;
      r++, c++
    ) {
      count++;
      tempWinningCells.push({ row: r, col: c });
    }
    if (count >= 4) winningCells.push(...tempWinningCells);

    // Check diagonal (bottom-right to top-left)
    count = 1;
    tempWinningCells = [{ row, col }];
    for (
      let r = row - 1, c = col + 1;
      r >= 0 && c < COLS && board[c][r] === player;
      r--, c++
    ) {
      count++;
      tempWinningCells.push({ row: r, col: c });
    }
    for (
      let r = row + 1, c = col - 1;
      r < ROWS && c >= 0 && board[c][r] === player;
      r++, c--
    ) {
      count++;
      tempWinningCells.push({ row: r, col: c });
    }
    if (count >= 4) winningCells.push(...tempWinningCells);

    return winningCells;
  };

  const checkDraw = (board) => {
    for (let col = 0; col < COLS; col++) {
      if (board[col][ROWS - 1] === 0) return false;
    }
    return true;
  };

  const resetGame = () => {
    setGameState(
      Array(COLS)
        .fill()
        .map(() => Array(ROWS).fill(0))
    );
    setCurrentPlayer(1);
    setGameActive(true);
    setLastMove(null);
    setWinningCells([]);
  };

  const getStatusMessage = () => {
    if (!gameActive) {
      if (winningCells.length > 0) {
        return `¡Jugador ${currentPlayer} (${
          currentPlayer === 1 ? "Rojo" : "Amarillo"
        }) ha ganado!`;
      }
      return "¡Empate!";
    }
    return `Turno del Jugador ${currentPlayer} (${
      currentPlayer === 1 ? "Rojo" : "Amarillo"
    })`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="text-center text-2xl">4 en Raya</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={styles.status}>{getStatusMessage()}</div>

          <div style={styles.board}>
            {Array(COLS)
              .fill()
              .map((_, col) => (
                <div key={col} style={styles.column}>
                  <div
                    style={styles.columnSelector}
                    onClick={() => makeMove(col)}
                  />
                  {Array(ROWS)
                    .fill()
                    .map((_, row) => {
                      const value = gameState[col][ROWS - 1 - row];
                      const isWinning = winningCells.some(
                        (cell) =>
                          cell.row === ROWS - 1 - row && cell.col === col
                      );

                      return (
                        <div
                          key={`${col}-${row}`}
                          style={{
                            ...styles.cell,
                            ...(value === 1 && styles.red),
                            ...(value === 2 && styles.yellow),
                            ...(isWinning && styles.winning),
                          }}
                        />
                      );
                    })}
                </div>
              ))}
          </div>

          <div style={styles.controls}>
            <button style={styles.button} onClick={resetGame}>
              Reiniciar Juego
            </button>
          </div>
        </CardContent>
      </Card>

      <style>
        {`
          @keyframes drop {
            from {transform: translateY(-300px);}
            to {transform: translateY(0);}
          }
          @keyframes pulse {
            0% {transform: scale(1);}
            50% {transform: scale(1.1);}
            100% {transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
};

export default FourInARow;
