// Servicio para manejar juegos dinámicos
import React from "react";
import * as Babel from "@babel/standalone";
import Navbar from "../components/Navbar";

const STORAGE_KEY = "dynamic-games";

// Función para validar un juego
const isValidGame = (game) => {
  return (
    game &&
    typeof game === "object" &&
    typeof game.name === "string" &&
    typeof game.path === "string" &&
    Array.isArray(game.categories) &&
    typeof game.code === "string"
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

// Función para reconstruir el componente desde el código
const rebuildComponent = (code) => {
  try {
    // Transformar el código usando Babel
    const transformedCode = Babel.transform(code, {
      presets: ["react"],
      plugins: [["transform-modules-commonjs", { strictMode: false }]],
    }).code;

    // Crear un módulo dinámico
    const module = { exports: {} };
    const exports = module.exports;

    // Ejecutar el código transformado
    const gameFunction = new Function(
      "React",
      "useState",
      "module",
      "exports",
      "require",
      transformedCode
    );

    // Función require simulada con componentes predefinidos
    const require = (path) => {
      if (path.startsWith("react")) {
        return React;
      }
      if (path.includes("Navbar")) {
        return Navbar;
      }
      if (path.startsWith("./")) {
        return {};
      }
      return {};
    };

    gameFunction(React, React.useState, module, exports, require);

    const Component = module.exports.default || exports.default;

    if (typeof Component !== "function") {
      throw new Error("El componente no es una función válida");
    }

    // Crear un componente funcional que envuelva el componente original
    const WrappedComponent = (props) => {
      return React.createElement(Component, props);
    };

    return WrappedComponent;
  } catch (error) {
    console.error("Error al reconstruir el componente:", error);
    throw error;
  }
};

// Cargar juegos del localStorage al inicio
let dynamicGames = [];
try {
  const storedGames = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  // Filtrar solo los juegos válidos y reconstruir sus componentes
  dynamicGames = storedGames
    .filter(isValidGame)
    .map((game) => {
      try {
        const component = rebuildComponent(game.code);
        return {
          ...game,
          component,
        };
      } catch (error) {
        console.error(`Error al cargar el juego ${game.name}:`, error);
        return null;
      }
    })
    .filter(Boolean); // Eliminar juegos que fallaron al cargar

  // Actualizar localStorage con solo los juegos válidos
  if (dynamicGames.length !== storedGames.length) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(dynamicGames.map(extractGameMetadata))
    );
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

  // Reconstruir el componente
  const component = rebuildComponent(gameWithPath.code);

  // Guardar el juego completo con su componente
  const gameWithComponent = {
    ...gameWithPath,
    component,
  };

  dynamicGames.push(gameWithComponent);

  // Guardar en localStorage solo los metadatos
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(dynamicGames.map(extractGameMetadata))
  );
  return gameWithComponent;
};

export const getDynamicGames = () => {
  return [...dynamicGames];
};

export const removeDynamicGame = (path) => {
  dynamicGames = dynamicGames.filter((game) => game.path !== path);
  // Actualizar localStorage
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(dynamicGames.map(extractGameMetadata))
  );
};

export const clearDynamicGames = () => {
  dynamicGames = [];
  // Limpiar localStorage
  localStorage.removeItem(STORAGE_KEY);
};
