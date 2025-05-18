// Servicio para manejar juegos dinámicos
const STORAGE_KEY = "dynamic-games";

// Función para validar un juego
const isValidGame = (game) => {
  return (
    game &&
    typeof game === "object" &&
    typeof game.name === "string" &&
    typeof game.path === "string" &&
    Array.isArray(game.categories)
  );
};

// Función para extraer metadatos de un juego
const extractGameMetadata = (game) => ({
  name: game.name,
  path: game.path,
  description: game.description || "",
  categories: game.categories || [],
  code: game.code, // Guardamos el código fuente del juego
});

// Cargar juegos del localStorage al inicio
let dynamicGames = [];
try {
  const storedGames = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // Filtrar solo los juegos válidos
  dynamicGames = storedGames.filter(isValidGame);
  // Actualizar localStorage con solo los juegos válidos
  if (dynamicGames.length !== storedGames.length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicGames));
  }
} catch (error) {
  console.error("Error al cargar juegos dinámicos:", error);
  localStorage.removeItem(STORAGE_KEY);
}

export const addDynamicGame = (gameData) => {
  // Validar que el juego no exista ya
  if (dynamicGames.some((game) => game.path === gameData.path)) {
    throw new Error("Ya existe un juego con este nombre");
  }

  // Validar que el juego tenga todos los campos requeridos
  if (!isValidGame(gameData)) {
    throw new Error("El juego no tiene el formato correcto");
  }

  // Asegurarnos de que el path comienza con /
  const gameWithPath = {
    ...gameData,
    path: gameData.path.startsWith("/") ? gameData.path : `/${gameData.path}`,
  };

  // Guardar solo los metadatos
  const gameMetadata = extractGameMetadata(gameWithPath);
  dynamicGames.push(gameMetadata);

  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicGames));
  return gameWithPath;
};

export const getDynamicGames = () => {
  return [...dynamicGames];
};

export const removeDynamicGame = (path) => {
  dynamicGames = dynamicGames.filter((game) => game.path !== path);
  // Actualizar localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dynamicGames));
};

export const clearDynamicGames = () => {
  dynamicGames = [];
  // Limpiar localStorage
  localStorage.removeItem(STORAGE_KEY);
};
