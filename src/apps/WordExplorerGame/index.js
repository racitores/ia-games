import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WordExplorerGame = () => {
  // Estados para manejar el juego
  const [gameState, setGameState] = useState('setup'); // setup, playing, results
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentLetter, setCurrentLetter] = useState('');
  const [word, setWord] = useState('');
  const [fact, setFact] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [teams, setTeams] = useState([{ name: 'Equipo 1', score: 0 }]);
  const [activeTeam, setActiveTeam] = useState(0);
  const [timer, setTimer] = useState(null);
  const [maxTime, setMaxTime] = useState(30);

  // Categorías y letras disponibles
  const categories = ['Animales', 'Países', 'Comidas', 'Deportes', 'Profesiones', 'Objetos de casa'];
  const letters = 'ABCDEFGHIJLMNOPQRST'.split('');

  // Iniciar una nueva ronda
  const startNewRound = () => {
    // Seleccionar categoría y letra al azar
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    
    setCurrentCategory(randomCategory);
    setCurrentLetter(randomLetter);
    setTimeLeft(maxTime);
    setWord('');
    setFact('');
    setGameState('playing');
    
    // Iniciar temporizador
    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(interval);
          endRound();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    setTimer(interval);
  };

  // Finalizar la ronda actual
  const endRound = () => {
    if (timer) clearInterval(timer);
    
    if (currentRound >= totalRounds) {
      setGameState('results');
    } else {
      setGameState('setup');
      setCurrentRound(prev => prev + 1);
    }
  };

  // Enviar una respuesta
  const submitAnswer = () => {
    if (!word.trim() || !fact.trim()) return;
    
    // Calcular puntos basados en el tiempo restante
    const timeBonus = Math.floor(timeLeft / maxTime * 100);
    const points = 50 + timeBonus;
    
    // Guardar la respuesta
    const newAnswer = {
      word: word.trim(),
      fact: fact.trim(),
      timeBonus,
      points,
      category: currentCategory,
      letter: currentLetter
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    
    // Actualizar puntuación del equipo
    const updatedTeams = [...teams];
    updatedTeams[activeTeam].score += points;
    setTeams(updatedTeams);
    
    // Limpiar campos
    setWord('');
    setFact('');
    
    // Cambiar al siguiente equipo si hay más de uno
    if (teams.length > 1) {
      setActiveTeam(prev => (prev + 1) % teams.length);
    }
  };

  // Reiniciar el juego
  const resetGame = () => {
    setGameState('setup');
    setCurrentRound(1);
    setScore(0);
    setAnswers([]);
    setTeams(teams.map(team => ({ ...team, score: 0 })));
  };

  // Agregar un equipo
  const addTeam = () => {
    if (teams.length < 4) {
      setTeams(prev => [...prev, { name: `Equipo ${prev.length + 1}`, score: 0 }]);
    }
  };

  // Limpiar temporizador cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="mb-4">
        <CardHeader className="bg-blue-500 text-white">
          <CardTitle className="text-center text-2xl">El Explorador de Palabras</CardTitle>
        </CardHeader>
        <CardContent>
          {gameState === 'setup' && (
            <div className="space-y-4 p-4">
              <h2 className="text-xl font-bold text-center mb-6">Configuración</h2>
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Número de rondas:</span>
                <div className="flex items-center">
                  <button 
                    className="px-3 py-1 bg-gray-200 rounded-l"
                    onClick={() => setTotalRounds(prev => Math.max(1, prev - 1))}
                  >-</button>
                  <span className="px-4 py-1 bg-gray-100">{totalRounds}</span>
                  <button 
                    className="px-3 py-1 bg-gray-200 rounded-r"
                    onClick={() => setTotalRounds(prev => prev + 1)}
                  >+</button>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Tiempo por ronda (seg):</span>
                <div className="flex items-center">
                  <button 
                    className="px-3 py-1 bg-gray-200 rounded-l"
                    onClick={() => setMaxTime(prev => Math.max(10, prev - 5))}
                  >-</button>
                  <span className="px-4 py-1 bg-gray-100">{maxTime}</span>
                  <button 
                    className="px-3 py-1 bg-gray-200 rounded-r"
                    onClick={() => setMaxTime(prev => prev + 5)}
                  >+</button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Equipos:</h3>
                {teams.map((team, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) => {
                        const newTeams = [...teams];
                        newTeams[index].name = e.target.value;
                        setTeams(newTeams);
                      }}
                      className="border rounded p-2 flex-grow"
                    />
                    <span className="ml-2">Puntos: {team.score}</span>
                  </div>
                ))}
                {teams.length < 4 && (
                  <button 
                    onClick={addTeam}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Añadir equipo
                  </button>
                )}
              </div>
              
              <div className="text-center">
                <button 
                  onClick={startNewRound}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold"
                >
                  {currentRound === 1 ? "¡Empezar juego!" : "Siguiente ronda"}
                </button>
              </div>
            </div>
          )}
          
          {gameState === 'playing' && (
            <div className="space-y-4 p-4">
              <div className="flex justify-between mb-2">
                <span>Ronda: {currentRound}/{totalRounds}</span>
                <span className="font-bold">Turno: {teams[activeTeam].name}</span>
              </div>
              
              <div className="bg-blue-100 p-4 rounded-lg mb-4 text-center">
                <h2 className="text-xl mb-2">Categoría: <strong>{currentCategory}</strong></h2>
                <h2 className="text-2xl">Letra: <strong className="text-3xl text-blue-600">{currentLetter}</strong></h2>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="text-center p-2 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
                  <span className="text-2xl font-bold">{timeLeft}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Palabra que empieza con '{currentLetter}':</label>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder={`Escribe un ${currentCategory.toLowerCase()} con ${currentLetter}...`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Dato interesante:</label>
                  <textarea
                    value={fact}
                    onChange={(e) => setFact(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Escribe un dato interesante sobre esta palabra..."
                    rows="3"
                  />
                </div>
                
                <div className="flex space-x-4 justify-center pt-2">
                  <button 
                    onClick={submitAnswer}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    disabled={!word.trim() || !fact.trim()}
                  >
                    Enviar respuesta
                  </button>
                  
                  <button 
                    onClick={endRound}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Terminar ronda
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Respuestas en esta ronda:</h3>
                <ul className="space-y-2">
                  {answers.filter(a => a.category === currentCategory && a.letter === currentLetter).map((answer, i) => (
                    <li key={i} className="border-l-4 border-blue-500 pl-2">
                      <strong>{answer.word}</strong> - {answer.fact}
                      <div className="text-sm text-gray-600">Bonus por tiempo: +{answer.timeBonus} pts | Total: {answer.points} pts</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {gameState === 'results' && (
            <div className="space-y-4 p-4">
              <h2 className="text-xl font-bold text-center mb-6">¡Fin del juego!</h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Puntuación final:</h3>
                {teams.sort((a, b) => b.score - a.score).map((team, index) => (
                  <div key={index} className={`p-2 mb-2 rounded ${index === 0 ? 'bg-yellow-100 border-l-4 border-yellow-400' : ''}`}>
                    {index === 0 && <span className="text-yellow-700 font-bold">🏆 GANADOR: </span>}
                    <span className="font-medium">{team.name}</span>: {team.score} puntos
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium mb-2">Todas las respuestas:</h3>
                {categories.filter(cat => answers.some(a => a.category === cat)).map(category => (
                  <div key={category} className="mb-4">
                    <h4 className="text-blue-600 mb-1">{category}:</h4>
                    <ul className="pl-4">
                      {answers.filter(a => a.category === category).map((answer, i) => (
                        <li key={i} className="mb-1">
                          <strong>{answer.word}</strong> ({answer.letter}) - {answer.fact} ({answer.points} pts)
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <button 
                  onClick={resetGame}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold"
                >
                  Jugar de nuevo
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WordExplorerGame;