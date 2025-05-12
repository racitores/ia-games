// Este archivo se generará automáticamente mediante tu pipeline CI/CD

// IMPORTANTE: No modifiques este archivo manualmente, se generará automáticamente
// basado en el contenido del directorio /src/apps

import { lazy } from "react";

// Importar todos los componentes de apps
const appContext = require.context("./apps", true, /\.(js|html)$/);
const rawContext = require.context("!raw-loader!./apps", true, /\.(js|html)$/);

// Función para extraer metadatos del código fuente
const extractMetadata = (sourceCode) => {
  if (!sourceCode) {
    console.warn("sourceCode es undefined o null");
    return {
      description: "",
      categories: [],
    };
  }

  const descriptionMatch = sourceCode.match(/\/\/\s*description:\s*(.+)/);
  const categoriesMatch = sourceCode.match(/\/\/\s*categories:\s*(.+)/);

  const metadata = {
    description: descriptionMatch ? descriptionMatch[1].trim() : "",
    categories: categoriesMatch
      ? categoriesMatch[1].split(",").map((cat) => cat.trim())
      : [],
  };

  console.log("Metadatos extraídos:", metadata);
  return metadata;
};

// Función para cargar juegos externos
const loadExternalGame = async (url) => {
  try {
    const response = await fetch(url);
    const sourceCode = await response.text();
    const metadata = extractMetadata(sourceCode);
    return { sourceCode, metadata };
  } catch (error) {
    console.error("Error al cargar el juego externo:", error);
    return null;
  }
};

// Función para añadir juegos externos
const addExternalGame = async (url) => {
  const game = await loadExternalGame(url);
  if (game) {
    // Aquí podrías implementar la lógica para añadir el juego a la lista
    console.log("Juego externo cargado:", game);
  }
};

// Generar rutas basadas en los archivos en el directorio apps
const routes = appContext.keys().map((key) => {
  console.log("Procesando archivo:", key);
  const appName = key.replace(/^\.\/(.*)\.(js|html)$/, "$1");
  const displayName = appName
    .split(/(?=[A-Z])/)
    .join(" ")
    .replace(/^\w/, (c) => c.toUpperCase());

  // Obtener el código fuente del archivo usando raw-loader
  const rawModule = rawContext(key);
  const sourceCode = rawModule.default || rawModule;
  console.log(
    "Código fuente obtenido para",
    appName,
    ":",
    sourceCode.substring(0, 100)
  );
  const metadata = extractMetadata(sourceCode);

  // Importar el componente de forma dinámica
  const Component = lazy(() => {
    console.log("Importando componente:", `./apps/${appName}`);
    return import(`./apps/${appName}`)
      .then((module) => {
        console.log("Módulo cargado:", module);
        // Si el módulo tiene una exportación por defecto, úsala
        if (module.default) {
          return { default: module.default };
        }
        // Si no, busca la primera exportación que sea un componente
        const component = Object.values(module).find(
          (value) => typeof value === "function" && value.name
        );
        if (component) {
          return { default: component };
        }
        throw new Error(`No se encontró un componente válido en ${appName}`);
      })
      .catch((error) => {
        console.error(`Error al cargar el componente ${appName}:`, error);
        throw error;
      });
  });

  return {
    path: `/${appName.toLowerCase()}`,
    element: <Component />,
    name: displayName,
    description: metadata.description,
    categories: metadata.categories,
  };
});

// Obtener todas las categorías únicas
export const categories = [
  ...new Set(routes.flatMap((route) => route.categories)),
].sort();

console.log("Categorías disponibles:", categories);
console.log("Rutas generadas:", routes);

// Función para filtrar rutas por categoría
export const filterRoutesByCategory = (category) => {
  return routes.filter((route) => route.categories.includes(category));
};

// Función para buscar rutas por texto
export const searchRoutes = (searchText) => {
  const searchLower = searchText.toLowerCase();
  return routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchLower) ||
      route.description.toLowerCase().includes(searchLower) ||
      route.categories.some((cat) => cat.toLowerCase().includes(searchLower))
  );
};

// Exportar las rutas y funciones auxiliares
export { routes, addExternalGame };

// Exportación por defecto para mantener compatibilidad
export default routes;
