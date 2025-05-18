// name: Contador
// description: Un simple contador interactivo que te permite incrementar y decrementar números
// categories: Interactivo, Básico, React, Matemáticas

import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Contador = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold mb-8">Contador</h1>

          <div className="text-6xl font-bold mb-8 text-blue-600">{count}</div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={decrement}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              -1
            </button>

            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset
            </button>

            <button
              onClick={increment}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              +1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contador;
