import React, { useState } from 'react';

const CalculadoraCompatibilidad = () => {
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [resultado, setResultado] = useState('');
  const [compatibilidad, setCompatibilidad] = useState('');
  const [explicacion, setExplicacion] = useState([]);
  const [pasos, setPasos] = useState([]);

  const calcularCompatibilidad = () => {
    // Verificar que ambos nombres estén ingresados
    if (!nombre1 || !nombre2) {
      setResultado('Por favor ingresa ambos nombres');
      setExplicacion([]);
      setPasos([]);
      setCompatibilidad('');
      return;
    }

    // Convertir nombres a minúsculas para consistencia
    const n1 = nombre1.toLowerCase();
    const n2 = nombre2.toLowerCase();
    
    // Combinar ambos nombres
    const nombresCombinados = n1 + n2;
    
    // Para llevar el registro de letras ya contadas
    const letrasContadas = new Set();
    
    let numeroResultado = '';
    let explicacionDetallada = [];
    
    // Procesar el primer nombre
    for (let i = 0; i < n1.length; i++) {
      const letra = n1[i];
      
      // Si ya contamos esta letra, la saltamos
      if (letrasContadas.has(letra)) continue;
      
      // Marcar esta letra como contada
      letrasContadas.add(letra);
      
      // Contar todas las ocurrencias de esta letra en ambos nombres
      let conteo = 0;
      for (let j = 0; j < nombresCombinados.length; j++) {
        if (nombresCombinados[j] === letra) {
          conteo++;
        }
      }
      
      // Añadir el conteo al resultado
      numeroResultado += conteo;
      explicacionDetallada.push({
        letra: letra,
        conteo: conteo
      });
    }
    
    // Procesar el segundo nombre
    for (let i = 0; i < n2.length; i++) {
      const letra = n2[i];
      
      // Si ya contamos esta letra, la saltamos
      if (letrasContadas.has(letra)) continue;
      
      // Marcar esta letra como contada
      letrasContadas.add(letra);
      
      // Contar todas las ocurrencias de esta letra en ambos nombres
      let conteo = 0;
      for (let j = 0; j < nombresCombinados.length; j++) {
        if (nombresCombinados[j] === letra) {
          conteo++;
        }
      }
      
      // Añadir el conteo al resultado
      numeroResultado += conteo;
      explicacionDetallada.push({
        letra: letra,
        conteo: conteo
      });
    }
    
    setResultado(numeroResultado);
    setExplicacion(explicacionDetallada);
    
    // Realizar la suma de extremos hasta tener un número de 2 dígitos
    let pasosSuma = [];
    let numActual = numeroResultado;
    
    pasosSuma.push({
      numero: numActual,
      descripcion: "Número inicial obtenido de contar letras"
    });
    
    while (numActual.length > 2) {
      let nuevoNum = '';
      let mitad = Math.floor(numActual.length / 2);
      let operaciones = [];
      
      for (let i = 0; i < mitad; i++) {
        let suma = parseInt(numActual[i]) + parseInt(numActual[numActual.length - 1 - i]);
        operaciones.push(`${numActual[i]} + ${numActual[numActual.length - 1 - i]} = ${suma}`);
        nuevoNum += suma;
      }
      
      // Si hay un dígito en el medio (longitud impar), lo mantenemos
      if (numActual.length % 2 !== 0) {
        nuevoNum += numActual[mitad];
        operaciones.push(`${numActual[mitad]} (dígito central, se mantiene)`);
      }
      
      pasosSuma.push({
        numero: nuevoNum,
        operaciones: operaciones
      });
      
      numActual = nuevoNum;
    }
    
    setPasos(pasosSuma);
    setCompatibilidad(numActual);
  };

  // Función para probar con ejemplos
  const probarEjemploNikolAitor = () => {
    setNombre1('Nikol');
    setNombre2('Aitor');
    setTimeout(calcularCompatibilidad, 100);
  };
  
  const probarEjemploMariaPedro = () => {
    setNombre1('María');
    setNombre2('Pedro');
    setTimeout(calcularCompatibilidad, 100);
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center">Calculadora de Compatibilidad</h1>
      <p className="text-gray-600 mb-6 text-center">Descubre el porcentaje de compatibilidad según sus nombres</p>
      
      <div className="w-full mb-4">
        <label className="block text-gray-700 mb-2">Primer Nombre:</label>
        <input
          type="text"
          value={nombre1}
          onChange={(e) => setNombre1(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Ingresa el primer nombre"
        />
      </div>
      
      <div className="w-full mb-6">
        <label className="block text-gray-700 mb-2">Segundo Nombre:</label>
        <input
          type="text"
          value={nombre2}
          onChange={(e) => setNombre2(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Ingresa el segundo nombre"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={calcularCompatibilidad}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Calcular Compatibilidad
        </button>
        
        <button
          onClick={probarEjemploNikolAitor}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Ejemplo: Nikol y Aitor
        </button>
        
        <button
          onClick={probarEjemploMariaPedro}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Ejemplo: María y Pedro
        </button>
      </div>
      
      {compatibilidad && (
        <div className="w-full p-4 mb-4 bg-pink-100 rounded-lg border-2 border-pink-300">
          <h2 className="text-xl font-bold text-center mb-2">Resultado:</h2>
          <div className="text-3xl font-bold text-center text-pink-600">
            {compatibilidad}% de compatibilidad
          </div>
        </div>
      )}
      
      {resultado && (
        <div className="w-full">
          <div className="p-4 bg-gray-100 rounded mb-4">
            <h3 className="text-lg font-semibold mb-2">Paso 1: Conteo de letras</h3>
            <div className="text-xl font-bold mb-2">{resultado}</div>
            
            {explicacion.length > 0 && (
              <div className="text-sm text-gray-600">
                <p className="mb-1">Explicación:</p>
                <ul className="list-disc pl-5">
                  {explicacion.map((item, index) => (
                    <li key={index}>
                      Letra "{item.letra}": aparece {item.conteo} veces entre ambos nombres
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {pasos.length > 1 && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-semibold mb-2">Paso 2: Cálculo de compatibilidad</h3>
              
              {pasos.map((paso, index) => (
                <div key={index} className="mb-4">
                  {index === 0 ? (
                    <div className="mb-2">
                      <span className="font-medium">Número inicial:</span> {paso.numero}
                    </div>
                  ) : (
                    <div>
                      <div className="mb-1">
                        <span className="font-medium">Operaciones:</span>
                      </div>
                      <ul className="list-disc pl-5 mb-2">
                        {paso.operaciones.map((op, idx) => (
                          <li key={idx}>{op}</li>
                        ))}
                      </ul>
                      <div>
                        <span className="font-medium">Resultado:</span> {paso.numero}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculadoraCompatibilidad;