import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReservasPage = () => {
    const [sedes, setSedes] = useState([]);
    const [espacios, setEspacios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [sedeSeleccionada, setSedeSeleccionada] = useState('');
    const [userLabel, setUserLabel] = useState('Usuario'); 
    
    const [formData, setFormData] = useState({
        espacio: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: ''
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const inicializarPagina = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Extraemos el ID del usuario del token JWT para mostrarlo en la UI
                const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                setUserLabel(`ID Usuario: ${payload.user_id}`);
            } catch (e) {
                setUserLabel('Sesión Activa');
            }
        }

        try {
            const config = { headers: getAuthHeader() };
            const [resSedes, resReservas, resEspacios] = await Promise.all([
                axios.get('http://localhost:8000/api/sedes/', config),
                axios.get('http://localhost:8000/api/reservas/', config),
                axios.get('http://localhost:8000/api/espacios/', config)
            ]);

            setSedes(resSedes.data);
            setReservas(resReservas.data);
            setEspacios(resEspacios.data);
        } catch (err) {
            console.error("Error cargando datos de la API", err);
        }
    };

    useEffect(() => {
        inicializarPagina();
    }, []);

    const obtenerInfoReserva = (espacioId) => {
        const espacio = espacios.find(e => e.id === espacioId);
        if (!espacio) return "Cargando...";
        const sede = sedes.find(s => s.id === espacio.sede);
        return `${sede ? sede.nombre : 'Sede'} - ${espacio.nombre}`;
    };

    const espaciosFiltrados = espacios.filter(esp => esp.sede === parseInt(sedeSeleccionada));

    // --- LÓGICA DE VALIDACIÓN (REGLAS DE NEGOCIO) ---
    const validarReserva = () => {
        const ahora = new Date();
        
        // Creamos objetos de fecha para cálculos de tiempo
        const inicio = new Date(`2000-01-01T${formData.hora_inicio}`);
        const fin = new Date(`2000-01-01T${formData.hora_fin}`);
        const duracionHoras = (fin - inicio) / (1000 * 60 * 60);

        // 1. NO FECHAS PASADAS: Evita reservar ayer o hace una hora
        const momentoReserva = new Date(`${formData.fecha}T${formData.hora_inicio}`);
        if (momentoReserva < ahora) {
            alert("❌ No puedes reservar en el pasado. Elige una fecha y hora futura.");
            return false;
        }

        // 2. ANTELACIÓN MÁXIMA: Máximo 30 días vista
        const limiteFuturo = new Date();
        limiteFuturo.setDate(limiteFuturo.getDate() + 30);
        if (momentoReserva > limiteFuturo) {
            alert("❌ Solo puedes reservar con un máximo de 30 días de antelación.");
            return false;
        }

        // 3. ORDEN CRONOLÓGICO: La salida debe ser después de la entrada
        if (formData.hora_inicio >= formData.hora_fin) {
            alert("❌ La hora de finalización debe ser posterior a la de inicio.");
            return false;
        }

        // 4. DURACIÓN MÍNIMA/MÁXIMA: Entre 30 min y 8 horas
        if (duracionHoras < 0.5) {
            alert("❌ La reserva debe ser de al menos 30 minutos.");
            return false;
        }
        if (duracionHoras > 8) {
            alert(`❌ El máximo permitido son 8 horas por día. Tu reserva es de ${duracionHoras}h.`);
            return false;
        }

        // 5. HORARIO DE APERTURA: 08:00 a 20:00
        const apertura = "08:00";
        const cierre = "20:00";
        if (formData.hora_inicio < apertura || formData.hora_fin > cierre) {
            alert(`❌ El coworking solo opera de ${apertura} a ${cierre}.`);
            return false;
        }

        // 6. DISPONIBILIDAD (SOLAPAMIENTO): Verifica si el sitio ya está ocupado
        const tieneConflicto = reservas.find(r => {
            if (r.espacio === parseInt(formData.espacio) && r.fecha === formData.fecha) {
                return (
                    (formData.hora_inicio >= r.hora_inicio && formData.hora_inicio < r.hora_fin) ||
                    (formData.hora_fin > r.hora_inicio && formData.hora_fin <= r.hora_fin) ||
                    (formData.hora_inicio <= r.hora_inicio && formData.hora_fin >= r.hora_fin)
                );
            }
            return false;
        });

        if (tieneConflicto) {
            alert("❌ Este espacio ya está reservado en ese horario. Prueba otra hora.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Si no pasa las validaciones, no enviamos nada al servidor
        if (!validarReserva()) return; 

        try {
            const token = localStorage.getItem('token');
            const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            
            const dataParaEnviar = {
                ...formData,
                espacio: parseInt(formData.espacio),
                usuario: payload.user_id 
            };

            await axios.post('http://localhost:8000/api/reservas/', dataParaEnviar, {
                headers: getAuthHeader()
            });
            alert('✅ Reserva guardada con éxito');
            window.location.reload(); 
        } catch (error) {
            alert('❌ Error al guardar la reserva. Verifica la conexión.');
        }
    };

    // --- ESTILOS MODERNOS, UNIFORMES Y RESPONSIVOS ---
    const styles = {
        mainWrapper: {
            minHeight: '100vh',
            width: '100%',
            backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1500&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative',
            fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            color: '#333'
        },
        overlay: {
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(30, 39, 46, 0.75)', 
            zIndex: 1
        },
        contentContainer: {
            position: 'relative',
            zIndex: 2,
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
            gap: '30px',
            width: '95%', 
            maxWidth: '1800px',
            margin: '60px auto'
        },
        card: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)', 
            padding: '45px',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            height: 'fit-content'
        },
        sectionTitle: { color: '#1e272e', fontSize: '26px', fontWeight: '600', marginBottom: '35px' },
        label: { fontWeight: '500', display: 'block', marginBottom: '10px', fontSize: '15px', color: '#485460' },
        input: {
            width: '100%', padding: '16px', marginBottom: '25px', borderRadius: '12px', border: '1px solid #dcdde1',
            boxSizing: 'border-box', fontSize: '16px', fontFamily: 'inherit', color: '#2f3542', backgroundColor: '#f9f9f9'
        },
        button: {
            width: '100%', padding: '18px', backgroundColor: '#1abc9c', color: 'white', border: 'none', borderRadius: '12px',
            cursor: 'pointer', fontWeight: '600', fontSize: '16px', fontFamily: 'inherit', marginTop: '10px'
        }
    };

    return (
        <div style={styles.mainWrapper}>
            <div style={styles.overlay}></div>
            
            <div style={styles.contentContainer}>
                
                {/* BLOQUE IZQUIERDO: FORMULARIO */}
                <div style={styles.card}>
                    <h2 style={styles.sectionTitle}>Nueva Reserva</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                            <div>
                                <label style={styles.label}>Sede</label>
                                <select style={styles.input} required onChange={e => setSedeSeleccionada(e.target.value)}>
                                    <option value="">-- Selecciona --</option>
                                    {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={styles.label}>Espacio</label>
                                <select style={styles.input} required disabled={!sedeSeleccionada} onChange={e => setFormData({...formData, espacio: e.target.value})}>
                                    <option value="">-- Selecciona --</option>
                                    {espaciosFiltrados.map(esp => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                                </select>
                            </div>
                        </div>

                        <label style={styles.label}>Fecha de Reserva</label>
                        <input type="date" style={styles.input} required onChange={e => setFormData({...formData, fecha: e.target.value})} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                            <div>
                                <label style={styles.label}>Hora de Inicio</label>
                                <input type="time" style={styles.input} required onChange={e => setFormData({...formData, hora_inicio: e.target.value})} />
                            </div>
                            <div>
                                <label style={styles.label}>Hora de Fin</label>
                                <input type="time" style={styles.input} required onChange={e => setFormData({...formData, hora_fin: e.target.value})} />
                            </div>
                        </div>

                        <button type="submit" style={styles.button}>Confirmar y Guardar Reserva</button>
                    </form>
                </div>

                {/* BLOQUE DERECHO: LISTADO */}
                <div style={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                        <h2 style={styles.sectionTitle}>Mis Reservas</h2>
                        <span style={{ fontSize: '13px', backgroundColor: '#2f3542', color: 'white', padding: '8px 16px', borderRadius: '50px', fontWeight: '500' }}>
                            👤 {userLabel}
                        </span>
                    </div>
                    
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {reservas.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#a4b0be', fontSize: '16px', marginTop: '50px' }}>No hay reservas activas.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {reservas.map(r => (
                                    <li key={r.id} style={{ padding: '25px', marginBottom: '20px', borderRadius: '16px', border: '1px solid #f1f2f6', backgroundColor: '#fff' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', marginBottom: '8px' }}>
                                            {obtenerInfoReserva(r.espacio)}
                                        </div>
                                        <div style={{ fontSize: '15px', color: '#1abc9c', fontWeight: '600' }}>📅 {r.fecha}</div>
                                        <div style={{ fontSize: '15px', color: '#747d8c', marginTop: '8px' }}>🕒 {r.hora_inicio.slice(0,5)} - {r.hora_fin.slice(0,5)}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ReservasPage;