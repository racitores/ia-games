// Este archivo se generará automáticamente mediante tu pipeline CI/CD

// IMPORTANTE: No modifiques este archivo manualmente, se generará automáticamente
// basado en el contenido del directorio /src/apps

import React, { Suspense } from "react";
import DynamicGameLoader from "./components/DynamicGameLoader";
import { getDynamicGames, addStaticGames } from "./services/dynamicGames";
import Navbar from "./components/Navbar";

// Componente de carga
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-2xl text-blue-600">Cargando...</div>
  </div>
);

// Componente wrapper para juegos
const GameWrapper = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <Navbar />
    {children}
  </div>
);

// Cargar juegos estáticos
const appsContext = require.context("./apps", true, /\.js$/);

const staticGames = appsContext.keys().map((key) => {
  const name = key.split("/").pop().replace(/\.js$/, "");
  const path = `/${name.toLowerCase().replace(/\s+/g, "-")}`;
  const source = appsContext(key).toString();

  // Extraer metadatos del código fuente
  const nameMatch = source.match(/\/\/\s*name:\s*(.+)/);
  const descriptionMatch = source.match(/\/\/\s*description:\s*(.+)/);
  const categoriesMatch = source.match(/\/\/\s*categories:\s*(.+)/);

  let categories = ["General"];
  if (categoriesMatch) {
    try {
      categories = categoriesMatch[1]
        .split(",")
        .map((cat) => cat.trim())
        .filter(Boolean);
    } catch (error) {
      console.error(`Error al procesar categorías para ${name}:`, error);
    }
  }

  return {
    name: nameMatch ? nameMatch[1].trim() : name,
    description: descriptionMatch
      ? descriptionMatch[1].trim()
      : `Juego ${name}`,
    categories: categories,
    path: path,
    code: source,
    isStatic: true,
  };
});

// Añadir juegos estáticos al servicio
addStaticGames(staticGames);

// Obtener todos los juegos
const games = getDynamicGames().map((game) => {
  const GameComponent = game.component;
  return {
    path: game.path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <GameWrapper>
          <GameComponent />
        </GameWrapper>
      </Suspense>
    ),
    name: game.name,
    description: game.description,
    categories: game.categories,
  };
});

// Crear todas las rutas
const allRoutes = [
  {
    path: "/load-game",
    element: <DynamicGameLoader />,
  },
  ...games,
];

// Exportar las rutas
export const routes = allRoutes;

// Exportar categorías únicas
export const categories = [
  ...new Set(allRoutes.flatMap((route) => route.categories || [])),
];

export default routes;
