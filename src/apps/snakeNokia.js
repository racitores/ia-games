// description: El clásico juego de la serpiente con controles táctiles y de teclado
// categories: Diversión, Clásicos, Arcade
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SnakeNokia = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentDirection, setCurrentDirection] = useState("derecha");
  const gameStateRef = useRef({
    snake: [
      { x: 7, y: 7 },
      { x: 6, y: 7 },
      { x: 5, y: 7 },
    ],
    food: null,
    direction: "right",
    nextDirection: "right",
    gameInterval: null,
    blockSize: 20,
    width: 15,
    height: 15,
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
    minSwipeDistance: 30,
  });

  // Inicialización del juego
  const init = () => {
    const state = gameStateRef.current;
    state.snake = [
      { x: 7, y: 7 },
      { x: 6, y: 7 },
      { x: 5, y: 7 },
    ];
    state.direction = "right";
    state.nextDirection = "right";
    setScore(0);
    setIsPaused(true);
    setIsGameOver(false);
    setCurrentDirection("derecha");
    createFood();
    drawGame();
  };

  // Crear comida
  const createFood = () => {
    const state = gameStateRef.current;
    state.food = {
      x: Math.floor(Math.random() * state.width),
      y: Math.floor(Math.random() * state.height),
    };
    // Evitar que la comida aparezca sobre la serpiente
    for (let segment of state.snake) {
      if (segment.x === state.food.x && segment.y === state.food.y) {
        return createFood();
      }
    }
  };

  // Actualizar visualización de dirección
  const updateDirectionDisplay = (direction) => {
    let dirText = "";
    switch (direction) {
      case "left":
        dirText = "izquierda";
        break;
      case "right":
        dirText = "derecha";
        break;
      case "up":
        dirText = "arriba";
        break;
      case "down":
        dirText = "abajo";
        break;
    }
    setCurrentDirection(dirText);
  };

  // Dibujar el juego
  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = gameStateRef.current;

    // Limpiar el canvas
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar la serpiente
    state.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? "#2ecc71" : "#27ae60";
      ctx.fillRect(
        segment.x * state.blockSize,
        segment.y * state.blockSize,
        state.blockSize,
        state.blockSize
      );

      // Borde del segmento
      ctx.strokeStyle = "#1e8449";
      ctx.strokeRect(
        segment.x * state.blockSize,
        segment.y * state.blockSize,
        state.blockSize,
        state.blockSize
      );
    });

    // Dibujar la comida
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(
      state.food.x * state.blockSize,
      state.food.y * state.blockSize,
      state.blockSize,
      state.blockSize
    );

    // Borde de la comida
    ctx.strokeStyle = "#c0392b";
    ctx.strokeRect(
      state.food.x * state.blockSize,
      state.food.y * state.blockSize,
      state.blockSize,
      state.blockSize
    );
  };

  // Actualizar la lógica del juego
  const updateGame = () => {
    const state = gameStateRef.current;

    // Cambiar dirección si es válido
    if (
      (state.nextDirection === "left" && state.direction !== "right") ||
      (state.nextDirection === "right" && state.direction !== "left") ||
      (state.nextDirection === "up" && state.direction !== "down") ||
      (state.nextDirection === "down" && state.direction !== "up")
    ) {
      state.direction = state.nextDirection;
      updateDirectionDisplay(state.direction);
    }

    // Calcular la nueva posición de la cabeza
    const head = { x: state.snake[0].x, y: state.snake[0].y };
    switch (state.direction) {
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
    }

    // Comprobar colisiones con las paredes
    if (
      head.x < 0 ||
      head.x >= state.width ||
      head.y < 0 ||
      head.y >= state.height
    ) {
      gameOver();
      return;
    }

    // Comprobar colisiones con la propia serpiente
    for (let i = 1; i < state.snake.length; i++) {
      if (head.x === state.snake[i].x && head.y === state.snake[i].y) {
        gameOver();
        return;
      }
    }

    // Añadir nueva cabeza
    state.snake.unshift(head);

    // Comprobar si come la comida
    if (head.x === state.food.x && head.y === state.food.y) {
      setScore((prev) => prev + 10);
      createFood();
    } else {
      // Si no come, eliminar el último segmento
      state.snake.pop();
    }

    // Actualizar el canvas
    drawGame();
  };

  // Finalizar juego
  const gameOver = () => {
    setIsGameOver(true);
    clearInterval(gameStateRef.current.gameInterval);
  };

  // Iniciar juego
  const startGame = () => {
    if (isGameOver) {
      init();
    }
    if (isPaused) {
      setIsPaused(false);
      gameStateRef.current.gameInterval = setInterval(updateGame, 200);
    } else {
      clearInterval(gameStateRef.current.gameInterval);
      init();
      setIsPaused(false);
      gameStateRef.current.gameInterval = setInterval(updateGame, 200);
    }
  };

  // Pausar juego
  const pauseGame = () => {
    if (!isPaused && !isGameOver) {
      clearInterval(gameStateRef.current.gameInterval);
      setIsPaused(true);
    } else if (isPaused && !isGameOver) {
      gameStateRef.current.gameInterval = setInterval(updateGame, 200);
      setIsPaused(false);
    }
  };

  // Manejar deslizamiento táctil
  const handleTouchStart = (e) => {
    const state = gameStateRef.current;
    state.touchStartX = e.touches[0].clientX;
    state.touchStartY = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isGameOver || isPaused) return;

    const state = gameStateRef.current;
    state.touchEndX = e.changedTouches[0].clientX;
    state.touchEndY = e.changedTouches[0].clientY;

    const deltaX = state.touchEndX - state.touchStartX;
    const deltaY = state.touchEndY - state.touchStartY;

    if (
      Math.abs(deltaX) < state.minSwipeDistance &&
      Math.abs(deltaY) < state.minSwipeDistance
    ) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && state.direction !== "left") {
        state.nextDirection = "right";
      } else if (deltaX < 0 && state.direction !== "right") {
        state.nextDirection = "left";
      }
    } else {
      if (deltaY > 0 && state.direction !== "up") {
        state.nextDirection = "down";
      } else if (deltaY < 0 && state.direction !== "down") {
        state.nextDirection = "up";
      }
    }
  };

  // Efecto para manejar eventos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      const state = gameStateRef.current;
      switch (event.key) {
        case "ArrowLeft":
          if (state.direction !== "right") state.nextDirection = "left";
          break;
        case "ArrowRight":
          if (state.direction !== "left") state.nextDirection = "right";
          break;
        case "ArrowUp":
          if (state.direction !== "down") state.nextDirection = "up";
          break;
        case "ArrowDown":
          if (state.direction !== "up") state.nextDirection = "down";
          break;
        case " ":
          pauseGame();
          break;
        case "Enter":
          if (isPaused || isGameOver) startGame();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, isGameOver]);

  // Efecto para inicializar el juego
  useEffect(() => {
    init();
    return () => {
      if (gameStateRef.current.gameInterval) {
        clearInterval(gameStateRef.current.gameInterval);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="text-center text-2xl">
            Juego de la Serpiente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-xl font-bold">Puntuación: {score}</div>
          </div>

          <div
            className="relative mx-auto border-2 border-gray-800 bg-gray-100"
            style={{ width: "300px", height: "300px" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={(e) => e.preventDefault()}
          >
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="touch-none"
            />

            {isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white">
                <div className="text-center p-4">
                  <h2 className="text-2xl font-bold mb-2">¡Juego Terminado!</h2>
                  <p className="mb-4">Tu puntuación final: {score}</p>
                  <button
                    onClick={startGame}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Jugar de nuevo
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={startGame}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {isPaused ? "Iniciar Juego" : "Reiniciar"}
            </button>
            <button
              onClick={pauseGame}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              disabled={isGameOver}
            >
              {isPaused ? "Continuar" : "Pausar"}
            </button>
          </div>

          <div className="mt-4 p-3 bg-gray-100 rounded text-center">
            <p>
              Desliza el dedo en la pantalla para cambiar la dirección.
              <br />
              Dirección actual:{" "}
              <span className="font-bold text-blue-500">
                {currentDirection}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SnakeNokia;
