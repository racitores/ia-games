// Este archivo se generará automáticamente mediante tu pipeline CI/CD

// IMPORTANTE: No modifiques este archivo manualmente, se generará automáticamente
// basado en el contenido del directorio /src/apps

import React, { lazy, Suspense } from "react";
import DynamicGameLoader from "./components/DynamicGameLoader";

const appsContext = require.context("./apps", true, /\.js$/);

// Componente de carga
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-2xl text-blue-600">Cargando...</div>
  </div>
);

// Crear rutas estáticas
const staticGames = appsContext.keys().map((key) => {
  const name = key.split("/").pop().replace(/\.js$/, "");
  const path = `/${name.toLowerCase().replace(/\s+/g, "-")}`;
  const source = appsContext(key).toString();

  // Extraer metadatos del código fuente
  const nameMatch = source.match(/\/\/\s*name:\s*(.+)/);
  const descriptionMatch = source.match(/\/\/\s*description:\s*(.+)/);
  const categoriesMatch = source.match(/\/\/\s*categories:\s*(.+)/);

  // Crear el componente lazy
  const LazyComponent = lazy(() => import(`./apps/${name}.js`));

  return {
    path,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <LazyComponent />
      </Suspense>
    ),
    name: nameMatch ? nameMatch[1].trim() : name,
    description: descriptionMatch
      ? descriptionMatch[1].trim()
      : `Juego ${name}`,
    categories: categoriesMatch
      ? categoriesMatch[1].split(",").map((cat) => cat.trim())
      : ["General"],
  };
});

// Exportar las rutas
export const routes = [
  {
    path: "/load-game",
    element: <DynamicGameLoader />,
  },
  ...staticGames,
];

// Exportar categorías únicas
export const categories = [
  ...new Set(routes.flatMap((route) => route.categories || [])),
];

export default routes;
