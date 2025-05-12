// description: Aprende a leer la hora en un reloj analógico o normal de forma interactiva
// categories: Educativo, Matemáticas, Escolar
import { useState, useEffect } from "react";

export default function ClockLearningApp() {
  const [hour, setHour] = useState(Math.floor(Math.random() * 12) + 1);
  const [minute, setMinute] = useState(Math.floor(Math.random() * 12) * 5);
  const [userHour, setUserHour] = useState("");
  const [userMinute, setUserMinute] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [level, setLevel] = useState(1);
  const [mode, setMode] = useState("digital"); // 'digital' o 'verbal'
  const [userVerbalAnswer, setUserVerbalAnswer] = useState("");
  const [verbalOptions, setVerbalOptions] = useState([]);

  // Configurar posición de las manecillas
  const hourDegrees = hour * 30 + minute / 2;
  const minuteDegrees = minute * 6;

  // Convertir la hora actual a formato verbal
  const getVerbalTime = (h, m) => {
    if (m === 0) return `${h} en punto`;
    if (m === 15) return `${h} y cuarto`;
    if (m === 30) return `${h} y media`;
    if (m === 45) return `${h + 1} menos cuarto`;

    if (m < 30) return `${h} y ${m}`;
    return `${h + 1} menos ${60 - m}`;
  };

  // Generar opciones para respuesta verbal
  const generateVerbalOptions = () => {
    const correctAnswer = getVerbalTime(hour, minute);
    let options = [correctAnswer];

    // Generar 3 opciones incorrectas
    while (options.length < 4) {
      let newHour = Math.floor(Math.random() * 12) + 1;
      let newMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];

      let newOption = getVerbalTime(newHour, newMinute);
      if (
        !options.includes(newOption) &&
        (newHour !== hour || newMinute !== minute)
      ) {
        options.push(newOption);
      }
    }

    // Mezclar opciones
    return options.sort(() => Math.random() - 0.5);
  };

  const checkAnswer = () => {
    setTotalAttempts(totalAttempts + 1);

    if (mode === "digital") {
      if (parseInt(userHour) === hour && parseInt(userMinute) === minute) {
        setFeedback("¡Correcto! ¡Muy bien!");
        setScore(score + 1);
        setTimeout(newQuestion, 1500);
      } else {
        setFeedback("Intenta otra vez");
      }
    } else {
      const correctVerbal = getVerbalTime(hour, minute);
      if (userVerbalAnswer === correctVerbal) {
        setFeedback("¡Correcto! ¡Muy bien!");
        setScore(score + 1);
        setTimeout(newQuestion, 1500);
      } else {
        setFeedback("Intenta otra vez");
      }
    }
  };

  const showCorrectAnswer = () => {
    setShowAnswer(true);
    if (mode === "digital") {
      setFeedback(
        `La respuesta correcta es: ${hour}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    } else {
      setFeedback(`La respuesta correcta es: "${getVerbalTime(hour, minute)}"`);
    }
  };

  const newQuestion = () => {
    // Generar nueva hora según el nivel
    let newHour = Math.floor(Math.random() * 12) + 1;
    let newMinute = 0;

    if (level === 1) {
      // Nivel 1: Solo horas exactas (minutos = 0)
      newMinute = 0;
    } else if (level === 2) {
      // Nivel 2: Horas exactas o medias horas
      newMinute = Math.random() < 0.5 ? 0 : 30;
    } else if (level === 3) {
      // Nivel 3: Cualquier intervalo de 5 minutos
      newMinute = Math.floor(Math.random() * 12) * 5;
    } else if (level === 4) {
      // Nivel 4: Formato verbal (cuarto, media, menos cuarto)
      newMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    }

    setHour(newHour);
    setMinute(newMinute);
    setUserHour("");
    setUserMinute("");
    setUserVerbalAnswer("");
    setFeedback("");
    setShowAnswer(false);

    // Generar nuevas opciones verbales
    setVerbalOptions(generateVerbalOptions());
  };

  const changeLevel = (newLevel) => {
    setLevel(newLevel);
    setScore(0);
    setTotalAttempts(0);
    setTimeout(newQuestion, 100);
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setScore(0);
    setTotalAttempts(0);
    setVerbalOptions(generateVerbalOptions());
  };

  // Efectos
  useEffect(() => {
    // Inicializar las opciones verbales al cargar
    setVerbalOptions(generateVerbalOptions());
  }, []);

  // Efecto para regenerar opciones cuando cambia la hora/minuto
  useEffect(() => {
    if (mode === "verbal") {
      setVerbalOptions(generateVerbalOptions());
    }
  }, [hour, minute]);

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto bg-blue-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">
        Aprende las Horas del Reloj
      </h1>

      <div className="mb-4 w-full">
        <div className="flex justify-center space-x-4 mb-2">
          <button
            onClick={() => changeMode("digital")}
            className={`px-3 py-1 rounded ${
              mode === "digital" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            Modo Digital
          </button>
          <button
            onClick={() => changeMode("verbal")}
            className={`px-3 py-1 rounded ${
              mode === "verbal" ? "bg-purple-500 text-white" : "bg-gray-200"
            }`}
          >
            Modo Verbal
          </button>
        </div>

        <div className="flex flex-wrap justify-center space-x-2 mb-2">
          <button
            onClick={() => changeLevel(1)}
            className={`px-3 py-1 rounded ${
              level === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Nivel 1
          </button>
          <button
            onClick={() => changeLevel(2)}
            className={`px-3 py-1 rounded ${
              level === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Nivel 2
          </button>
          <button
            onClick={() => changeLevel(3)}
            className={`px-3 py-1 rounded ${
              level === 3 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Nivel 3
          </button>
          <button
            onClick={() => changeLevel(4)}
            className={`px-3 py-1 rounded ${
              level === 4 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Nivel 4
          </button>
        </div>
        <p className="text-sm text-gray-600 text-center">
          {level === 1
            ? "Horas exactas"
            : level === 2
            ? "Horas exactas y medias"
            : level === 3
            ? "Intervalos de 5 minutos"
            : "Cuartos y medias (verbal)"}
        </p>
      </div>

      <div className="relative w-64 h-64 rounded-full bg-white border-4 border-gray-800 shadow-lg mb-6">
        {/* Números del reloj */}
        {[...Array(12)].map((_, i) => {
          const num = i + 1;
          const angle = (num * 30 - 90) * (Math.PI / 180);
          const x = 32 + 24 * Math.cos(angle);
          const y = 32 + 24 * Math.sin(angle);

          return (
            <div
              key={num}
              className="absolute w-8 h-8 flex items-center justify-center text-xl font-bold"
              style={{
                left: `${50 + 40 * Math.cos(angle)}%`,
                top: `${50 + 40 * Math.sin(angle)}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {num}
            </div>
          );
        })}

        {/* Marcas de minutos */}
        {[...Array(60)].map((_, i) => {
          if (i % 5 !== 0) {
            const angle = (i * 6 - 90) * (Math.PI / 180);
            return (
              <div
                key={`tick-${i}`}
                className="absolute w-1 h-1 bg-gray-500 rounded-full"
                style={{
                  left: `${50 + 48 * Math.cos(angle)}%`,
                  top: `${50 + 48 * Math.sin(angle)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          }
          return null;
        })}

        {/* Manecilla de la hora */}
        <div
          className="absolute w-1 h-16 bg-black rounded-full origin-bottom left-1/2 -translate-x-1/2 bottom-1/2"
          style={{ transform: `translateX(-50%) rotate(${hourDegrees}deg)` }}
        />

        {/* Manecilla del minuto */}
        <div
          className="absolute w-1 h-24 bg-blue-600 rounded-full origin-bottom left-1/2 -translate-x-1/2 bottom-1/2"
          style={{ transform: `translateX(-50%) rotate(${minuteDegrees}deg)` }}
        />

        {/* Centro del reloj */}
        <div className="absolute w-4 h-4 bg-gray-800 rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {mode === "digital" ? (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="number"
            min="1"
            max="12"
            value={userHour}
            onChange={(e) => setUserHour(e.target.value)}
            className="w-16 p-2 border border-gray-300 rounded text-center"
            placeholder="Hora"
          />
          <span className="text-xl">:</span>
          <input
            type="number"
            min="0"
            max="59"
            step="5"
            value={userMinute}
            onChange={(e) => setUserMinute(e.target.value)}
            className="w-16 p-2 border border-gray-300 rounded text-center"
            placeholder="Min"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 w-full max-w-sm mb-4">
          {verbalOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => setUserVerbalAnswer(option)}
              className={`p-2 border rounded text-center ${
                userVerbalAnswer === option
                  ? "bg-blue-200 border-blue-500"
                  : "bg-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <div className="flex space-x-2 mb-4">
        <button
          onClick={checkAnswer}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Comprobar
        </button>
        <button
          onClick={showCorrectAnswer}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Ver respuesta
        </button>
        <button
          onClick={newQuestion}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Nueva hora
        </button>
      </div>

      <p
        className={`text-lg font-semibold ${
          feedback.includes("Correcto")
            ? "text-green-600"
            : feedback
            ? "text-red-600"
            : ""
        }`}
      >
        {feedback}
      </p>

      {showAnswer && (
        <p className="text-blue-600 font-medium">
          {mode === "digital"
            ? `La hora es: ${hour}:${minute.toString().padStart(2, "0")}`
            : `La hora es: "${getVerbalTime(hour, minute)}"`}
        </p>
      )}

      <div className="mt-4 p-2 bg-gray-100 rounded w-full text-center">
        <p className="font-medium">
          Puntuación: {score}/{totalAttempts}
        </p>
        <p className="text-sm text-gray-600">
          Modo:{" "}
          {mode === "digital"
            ? "Digital (00:00)"
            : "Verbal (en punto, y media...)"}
        </p>
      </div>

      <div className="mt-4 p-2 bg-white border border-gray-200 rounded w-full text-sm">
        <h3 className="font-bold mb-1">Instrucciones:</h3>
        <ul className="list-disc pl-5">
          <li>Modo Digital: Introduce la hora y minutos exactos.</li>
          <li>
            Modo Verbal: Selecciona la expresión que mejor describa la hora del
            reloj.
          </li>
          <li>Nivel 1: Solo horas exactas (3:00)</li>
          <li>Nivel 2: Horas exactas y medias (4:00, 4:30)</li>
          <li>Nivel 3: Intervalos de 5 minutos (5:05, 5:10, etc.)</li>
          <li>
            Nivel 4: Cuartos y medias para práctica verbal (en punto, y media, y
            cuarto, menos cuarto)
          </li>
        </ul>
      </div>
    </div>
  );
}
