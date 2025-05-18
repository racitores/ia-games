import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { routes, categories } from "../routes";
import Navbar from "./Navbar";

const Games = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filtrar juegos excluyendo la ruta de carga
  const availableGames = routes.filter((route) => route.path !== "/load-game");

  const filteredGames = availableGames.filter((game) => {
    const matchesSearch =
      searchTerm === "" ||
      (game.name &&
        game.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (game.description &&
        game.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "" ||
      (game.categories &&
        game.categories.some(
          (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
        ));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Juegos Disponibles</h1>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar juegos..."
            className="flex-1 p-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <Link
            to="/load-game"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            Cargar Juego
          </Link>
        </div>

        {/* Grid de juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card key={game.path}>
              <CardHeader className="bg-blue-500 text-white">
                <CardTitle>{game.name || "Sin nombre"}</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-gray-600 mb-4">
                  {game.description || "Sin descripción"}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {game.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <Link
                  to={game.path}
                  className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Jugar
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
