import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-gray-800">
                  🤖 AI Games
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🤖 AI Games</h1>
          <p className="text-xl text-gray-600 mb-8">
            Una colección de juegos interactivos desarrollados con IA y React
          </p>
          <Link
            to="/games"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Jugar Ahora
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle>🎲 Juegos Interactivos</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">
                Colección de juegos interactivos, diseñados para ofrecer
                una experiencia única y adaptativa.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-500 text-white">
              <CardTitle>🔍 Búsqueda Inteligente</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">
                Sistema de búsqueda y filtrado por categorías para encontrar el
                juego perfecto.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-purple-500 text-white">
              <CardTitle>📱 Diseño Responsive</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-600">
                Interfaz moderna y atractiva que se adapta a todos los
                dispositivos.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
