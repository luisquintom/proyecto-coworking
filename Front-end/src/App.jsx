import React, { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import ReservasPage from './pages/ReservasPage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

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
        <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}

export default App;