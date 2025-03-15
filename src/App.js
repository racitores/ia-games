import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import routes from './routes';

const NotFound = () => <div className="p-8 text-center">Aplicación no encontrada</div>;

const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold">
              Mis Aplicaciones
            </Link>
          </div>
          
          <div className="flex">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {routes.map((route) => (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === route.path
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {route.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === route.path
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {route.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={
                <div className="p-8 bg-white rounded-lg shadow">
                  <h1 className="text-2xl font-bold mb-4">Bienvenido a mi colección de aplicaciones</h1>
                  <p className="mb-4">Selecciona una aplicación del menú superior para comenzar.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {routes.map((route) => (
                      <Link
                        key={route.path}
                        to={route.path}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h2 className="text-lg font-medium">{route.name}</h2>
                        <p className="text-gray-600 text-sm mt-1">{route.description || 'Sin descripción'}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              } />
              
              {routes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;