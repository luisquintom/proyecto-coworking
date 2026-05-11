import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router";

function AuthPage({ onLoginSuccess }) {
    let navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });

    // Detectar el ancho de pantalla para el responsive manual
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 850);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 850);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                navigate("/reservas");
            } else {
                alert('¡Cuenta creada con éxito!');
                setIsLogin(true);
            }
        } catch (err) {
            console.error(err);
            alert('Error: Revisa tus credenciales.');
        }
    };

    const styles = {
        container: { 
            display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '97vh',  
            fontFamily: 'sans-serif', boxSizing: 'border-box',backgroundColor: '#010203'
        },
        imageSection: {
            display: 'flex',flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            backgroundImage: 'url("/principal_home.avif")', backgroundSize: 'cover', backgroundPosition: 'center',
            color: '#fff3cc', padding: '40px', position: 'relative', flex: isMobile ? '0 0 300px' : '1', textAlign: 'center'
        },
        overlay: { 
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(1,2,3,0.6)'
        },
        formSection: { 
            display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: 'url("/principal_home2.avif")',
            backgroundSize: 'cover', backgroundPosition: 'center', flex: '1', padding: '20px' 
        },
        card: { 
            width: '100%', maxWidth: '400px', padding: isMobile ? '25px' : '40px',backgroundColor: 'rgba(1,2,3,0.96)',
            borderRadius: '12px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)', zIndex: 2
        },
        input: { 
            width: '100%', padding: '12px 15px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #3B3130',
            backgroundColor: '#fff', boxSizing: 'border-box', fontSize: '16px'
        },
        button: { 
            width: '100%', padding: '14px', backgroundColor: '#D3AC2C', color: '#010203', border: 'none', borderRadius: '8px', 
            cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px'
        },
        title: {
            fontSize: isMobile ? '2.5rem' : '4rem', marginBottom: '1rem', position: 'relative', zIndex: 1
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.imageSection}>
                <div style={styles.overlay}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={styles.title}>Coworking Spaces</h1>
                    <p style={{ fontSize: '1.1rem', fontWeight: '300' }}>
                        Gestiona tus reservas de forma profesional.
                    </p>
                </div>
            </div>

            <div style={styles.formSection}>
                <div style={styles.card}>
                    <h2 style={{ color: '#B16C04', marginBottom: '25px', textAlign: 'center' }}>
                        {isLogin ? 'Bienvenido' : 'Registro'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                                gap: '10px' 
                            }}>
                                <input type="text" name="first_name" placeholder="Nombre" style={styles.input} onChange={handleChange} required />
                                <input type="text" name="last_name" placeholder="Apellido" style={styles.input} onChange={handleChange} required />
                            </div>
                        )}
                        <input type="email" name="email" placeholder="Correo" style={styles.input} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Contraseña" style={styles.input} onChange={handleChange} required />

                        <button type="submit" style={styles.button}>
                            {isLogin ? 'Entrar' : 'Crear Cuenta'}
                        </button>
                    </form>

                    <p style={{ marginTop: '20px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
                        {isLogin ? '¿Nuevo aquí? ' : '¿Ya eres miembro? '}
                        <span 
                            style={{ color: '#D3AC2C', cursor: 'pointer', fontWeight: 'bold' }} 
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Regístrate' : 'Inicia sesión'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;