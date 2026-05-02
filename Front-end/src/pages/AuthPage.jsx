import React, { useState } from 'react';
import axios from 'axios';

const AuthPage = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const baseURL = 'http://localhost:8000/api/';
        const endpoint = isLogin ? 'token/' : 'usuarios/registrar/';
        
        const dataToSubmit = isLogin 
            ? { username: formData.email, password: formData.password } 
            : formData;

        try {
            const res = await axios.post(`${baseURL}${endpoint}`, dataToSubmit);
            if (isLogin) {
                localStorage.setItem('token', res.data.access);
                onLoginSuccess();
            } else {
                alert('¡Cuenta creada con éxito!');
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            alert('Error: Revisa tus credenciales o conexión.');
        }
    };

    // ESTRUCTURA BASADA EN GRID Y FLEXBOX
    const styles = {
        // GRID: Divide la pantalla en dos columnas iguales
        container: { 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            height: '100vh', 
            width: '100vw', 
            fontFamily: 'sans-serif', 
            overflow: 'hidden' 
        },
        // FLEXBOX: Centra el contenido de la imagen (vertical - horizontal)
        imageSection: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '40px',
            position: 'relative'
        },
        overlay: { 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)' 
        },
        // FLEXBOX: Centra la tarjeta de login
        formSection: { 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f0f2f5' 
        },
        card: { 
            width: '100%', 
            maxWidth: '400px', 
            padding: '40px', 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)' 
        },
        input: { 
            width: '100%', 
            padding: '12px 15px', 
            marginBottom: '15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd', 
            boxSizing: 'border-box',
            fontSize: '16px'
        },
        button: { 
            width: '100%', 
            padding: '14px', 
            backgroundColor: '#2c3e50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            fontSize: '16px',
            marginTop: '10px'
        }
    };

    return (
        <div style={styles.container}>
            {/* SECCIÓN IZQUIERDA pantalla principal */}
            <div style={styles.imageSection}>
                <div style={styles.overlay}></div>
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>Coworking Spaces</h1>
                    <p style={{ fontSize: '1.2rem', fontWeight: '300' }}>Gestiona tus reservas de forma profesional.</p>
                </div>
            </div>

            {/* SECCIÓN DERECHA pantalla principal- LOGIN inicial */}
            <div style={styles.formSection}>
                <div style={styles.card}>
                    <h2 style={{ color: '#2c3e50', marginBottom: '30px', textAlign: 'center', fontSize: '24px' }}>
                        {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                    </h2>
                    
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            // GRID interno para colocar Nombre y Apellido en la misma línea
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <input type="text" name="first_name" placeholder="Nombre" style={styles.input} onChange={handleChange} required />
                                <input type="text" name="last_name" placeholder="Apellido" style={styles.input} onChange={handleChange} required />
                            </div>
                        )}
                        <input type="email" name="email" placeholder="Correo electrónico" style={styles.input} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Contraseña" style={styles.input} onChange={handleChange} required />
                        
                        <button type="submit" style={styles.button}>
                            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                        </button>
                    </form>

                    <p style={{ marginTop: '25px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                        {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                        <span 
                            style={{ color: '#3498db', cursor: 'pointer', fontWeight: 'bold' }} 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Regístrate' : 'Inicia sesión'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;