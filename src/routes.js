// Este archivo se generará automáticamente mediante tu pipeline CI/CD

// IMPORTANTE: No modifiques este archivo manualmente, se generará automáticamente
// basado en el contenido del directorio /src/apps

import React, { lazy } from "react";

// Importar todos los componentes de la carpeta apps
const appsContext = require.context("!raw-loader!./apps", true, /\.(js|html)$/);

// Función para extraer metadatos del código fuente
const extractMetadata = (sourceCode) => {
  try {
    // Asegurarnos de que tenemos el string del código fuente
    const code = sourceCode.default || sourceCode;

    const descriptionMatch = code.match(/\/\/\s*description:\s*(.+)/);
    const categoriesMatch = code.match(/\/\/\s*categories:\s*(.+)/);

    return {
      description: descriptionMatch ? descriptionMatch[1].trim() : "",
      categories: categoriesMatch
        ? categoriesMatch[1].split(",").map((cat) => cat.trim())
        : [],
    };
  } catch (error) {
    console.error("Error al extraer metadatos:", error);
    return { description: "", categories: [] };
  }
};

// Función para cargar juegos
const loadGames = () => {
  const games = [];
  appsContext.keys().forEach((key) => {
    try {
      const name = key
        .split("/")
        .pop()
        .replace(/\.(js|html)$/, "");
      const sourceCode = appsContext(key);
      const metadata = extractMetadata(sourceCode);

      // Crear el componente lazy usando la ruta correcta
      const Component = lazy(() => import(`./apps/${name}.js`));

      games.push({
        path: `/${name.toLowerCase().replace(/\s+/g, "-")}`,
        name: name,
        element: <Component />,
        description: metadata.description,
        categories: metadata.categories,
      });
    } catch (error) {
      console.error(`Error al cargar el juego ${key}:`, error);
    }
  });
  return games;
};

// Generar rutas
const routes = loadGames();

// Exportar categorías únicas
export const categories = [
  ...new Set(routes.flatMap((route) => route.categories || [])),
];

// Función para filtrar rutas por categoría
export const filterRoutesByCategory = (category) => {
  return routes.filter((route) =>
    route.categories ? route.categories.includes(category) : false
  );
};

// Función para buscar rutas
export const searchRoutes = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return routes.filter(
    (route) =>
      route.name.toLowerCase().includes(term) ||
      route.description.toLowerCase().includes(term) ||
      (route.categories &&
        route.categories.some((cat) => cat.toLowerCase().includes(term)))
  );
};

export default routes;
