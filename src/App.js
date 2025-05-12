import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import routes, {
  categories,
  filterRoutesByCategory,
  searchRoutes,
} from "./routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Componente de carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(routes);

  // Debug: Mostrar las categorías disponibles y las rutas al cargar
  useEffect(() => {
    console.log("Categorías disponibles:", categories);
    console.log(
      "Rutas con sus categorías:",
      routes.map((route) => ({
        name: route.name,
        categories: route.categories,
      }))
    );
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredRoutes(searchRoutes(searchTerm));
    } else if (selectedCategory) {
      console.log("Filtrando por categoría:", selectedCategory);
      const filtered = filterRoutesByCategory(selectedCategory);
      console.log("Rutas filtradas:", filtered);
      setFilteredRoutes(filtered);
    } else {
      setFilteredRoutes(routes);
    }
  }, [searchTerm, selectedCategory]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800">
                    School Games
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <div className="mb-8">
                      <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Buscar juegos..."
                          className="flex-1 p-2 border rounded-lg"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setSelectedCategory("");
                          }}
                        />
                        <select
                          className="p-2 border rounded-lg"
                          value={selectedCategory}
                          onChange={(e) => {
                            console.log(
                              "Categoría seleccionada:",
                              e.target.value
                            );
                            setSelectedCategory(e.target.value);
                            setSearchTerm("");
                          }}
                        >
                          <option value="">Todas las categorías</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      {searchTerm && (
                        <div className="text-sm text-gray-600 mb-4">
                          Resultados de búsqueda para: "{searchTerm}"
                        </div>
                      )}

                      {selectedCategory && (
                        <div className="text-sm text-gray-600 mb-4">
                          Mostrando juegos de la categoría: {selectedCategory}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRoutes.map((route) => (
                        <Link
                          key={route.path}
                          to={route.path}
                          className="block hover:transform hover:scale-105 transition-transform duration-200"
                        >
                          <Card className="h-full">
                            <CardHeader className="bg-blue-500 text-white">
                              <CardTitle>{route.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                              <p className="text-gray-600 mb-2">
                                {route.description}
                              </p>
                              {route.categories &&
                                route.categories.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {route.categories.map((category) => (
                                      <span
                                        key={category}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                      >
                                        {category}
                                      </span>
                                    ))}
                                  </div>
                                )}
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                }
              />

              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
