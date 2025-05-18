import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { addDynamicGame } from "../services/dynamicGames";
import { useNavigate } from "react-router-dom";
import * as Babel from "@babel/standalone";

const DynamicGameLoader = () => {
  const [gameFile, setGameFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Efecto para redirigir automáticamente después de 3 segundos
  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        navigate("/");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const fileContent = await file.text();

      // Extraer metadatos del código fuente
      const descriptionMatch = fileContent.match(/\/\/\s*description:\s*(.+)/);
      const categoriesMatch = fileContent.match(/\/\/\s*categories:\s*(.+)/);
      const nameMatch = fileContent.match(/\/\/\s*name:\s*(.+)/);

      if (!nameMatch) {
        setError(
          "El archivo debe contener un nombre de juego (// name: Nombre del Juego)"
        );
        return;
      }

      const gameName = nameMatch[1].trim();
      const gamePath = `/${gameName.toLowerCase().replace(/\s+/g, "-")}`;

      // Transformar el código usando Babel
      const transformedCode = Babel.transform(fileContent, {
        presets: ["react"],
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
        transformedCode
      );

      gameFunction(React, React.useState, module, exports);

      const GameComponent = module.exports.default || exports.default;

      if (!GameComponent) {
        throw new Error(
          "El archivo debe exportar un componente React por defecto"
        );
      }

      // Crear una instancia del componente para verificar que funciona
      const GameInstance = <GameComponent />;

      const gameData = {
        name: gameName,
        description: descriptionMatch
          ? descriptionMatch[1].trim()
          : "Sin descripción",
        categories: categoriesMatch
          ? categoriesMatch[1].split(",").map((cat) => cat.trim())
          : ["Sin categoría"],
        path: gamePath,
        component: GameComponent,
        code: fileContent,
      };

      // Añadir el juego a la lista de juegos dinámicos
      addDynamicGame(gameData);
      setGameFile(gameData);
      setError(null);
      setSuccess(true);

      // Redirigir al juego después de un breve retraso
      setTimeout(() => {
        navigate(gamePath);
      }, 1000);
    } catch (err) {
      setError("Error al cargar el juego: " + err.message);
    }
  };

  const renderGamePreview = () => {
    if (!gameFile) return null;

    return (
      <Card className="mt-4">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle>{gameFile.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-gray-600 mb-4">{gameFile.description}</p>
          <div className="flex flex-wrap gap-2">
            {gameFile.categories.map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (success) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">¡Juego cargado con éxito!</h2>
          <p className="text-gray-600 mb-6">
            Serás redirigido automáticamente en 3 segundos...
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            Volver ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cargar Juego</h2>
      <div className="mb-4">
        <input
          type="file"
          accept=".js"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {renderGamePreview()}
    </div>
  );
};

export default DynamicGameLoader;
