import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import ReservasPage from './pages/ReservasPage';


function App() {
  // Estado para saber si el usuario está logeado
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Al cargar la app, verificamos si ya tiene un token guardado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Función para cerrar sesión (útil para tu entrega)
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <>
          <nav style={{ padding: '10px', backgroundColor: '#2c3e50', textAlign: 'right' }}>
            <button 
              onClick={handleLogout} 
              style={{ color: 'white', background: 'none', border: '1px solid white', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}
            >
              Cerrar Sesión
            </button>
          </nav>
          <ReservasPage />
        </>
      ) : (
        /* Le pasamos una función al AuthPage para que nos avise cuando el login sea exitoso */
        <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;