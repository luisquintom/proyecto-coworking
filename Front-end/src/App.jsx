import React, { useState, useEffect } from 'react';
import AuthPage from './components/AuthPage';
import ReservasPage from './components/ReservasPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SedesPage from "./components/SedesPage";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AuthPage onLoginSuccess={() => {
                    setIsLoggedIn(true);
                }}/>}/>
                <Route path="/reservas" element={<ReservasPage />}/>
                <Route path="/sedes" element={<SedesPage />}/>
                <Route path="*" element={<h1>404 Not Found</h1>}/>
            </Routes>
        </BrowserRouter>

    </div>
  );
}

export default App;