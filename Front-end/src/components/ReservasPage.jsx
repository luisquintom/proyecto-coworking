import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from "./NavBar";
import { useNavigate } from "react-router";

const ReservasPage = () => {
    const navigate = useNavigate();
    const [sedes, setSedes] = useState([]);
    const [espacios, setEspacios] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [sedeSeleccionada, setSedeSeleccionada] = useState('');
    const [userLabel, setUserLabel] = useState('Usuario');
    const [editandoId, setEditandoId] = useState(null); 

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
                const payload = JSON.parse(window.atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
                setUserLabel(`ID Usuario: ${payload.user_id}`);
            } catch (e) {
                setUserLabel('Sesión Activa');
            }
        } else {
            navigate("/");
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
    const eliminarReserva = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return;
        try {
            await axios.delete(`http://localhost:8000/api/reservas/${id}/`, { headers: getAuthHeader() });
            alert("✅ Reserva eliminada con éxito");
            setReservas(reservas.filter(r => r.id !== id));
        } catch (err) {
            alert("❌ Error al intentar eliminar la reserva");
        }
    };
    const prepararEdicion = (reserva) => {
        const espacio = espacios.find(e => e.id === reserva.espacio);
        setSedeSeleccionada(espacio?.sede || '');
        setFormData({
            espacio: reserva.espacio,
            fecha: reserva.fecha,
            hora_inicio: reserva.hora_inicio.slice(0, 5),
            hora_fin: reserva.hora_fin.slice(0, 5)
        });
        setEditandoId(reserva.id);
    };

    const cancelarEdicion = () => {
        setEditandoId(null);
        setFormData({ espacio: '', fecha: '', hora_inicio: '', hora_fin: '' });
        setSedeSeleccionada('');
    };

    const obtenerInfoReserva = (espacioId) => {
        const espacio = espacios.find(e => e.id === espacioId);
        if (!espacio) return "Cargando...";
        const sede = sedes.find(s => s.id === espacio.sede);
        return `${sede ? sede.nombre : 'Sede'} - ${espacio.nombre}`;
    };

    const espaciosFiltrados = espacios.filter(esp => esp.sede === parseInt(sedeSeleccionada));

    const validarReserva = () => {
        const ahora = new Date();
        const inicio = new Date(`2000-01-01T${formData.hora_inicio}`);
        const fin = new Date(`2000-01-01T${formData.hora_fin}`);
        const duracionHoras = (fin - inicio) / (1000 * 60 * 60);
        const momentoReserva = new Date(`${formData.fecha}T${formData.hora_inicio}`);
        
        if (momentoReserva < ahora) {
            alert("❌ No puedes reservar en el pasado.");
            return false;
        }
        if (formData.hora_inicio >= formData.hora_fin) {
            alert("❌ La hora de fin debe ser posterior a la de inicio.");
            return false;
        }
        if (duracionHoras < 0.5 || duracionHoras > 8) {
            alert("❌ La reserva debe durar entre 30 min y 8 horas.");
            return false;
        }

        const tieneConflicto = reservas.find(r => {
            if (editandoId && r.id === editandoId) return false;
            if (r.espacio === parseInt(formData.espacio) && r.fecha === formData.fecha) {
                return formData.hora_inicio < r.hora_fin && formData.hora_fin > r.hora_inicio;
            }
            return false;
        });

        if (tieneConflicto) {
            alert("❌ El espacio ya está ocupado en ese horario.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarReserva()) return; 

        try {
            const config = { headers: getAuthHeader() };
            const payload = JSON.parse(window.atob(config.headers.Authorization.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
            
            const dataParaEnviar = {
                ...formData,
                espacio: parseInt(formData.espacio),
                usuario: payload.user_id 
            };

            if (editandoId) {
                await axios.put(`http://localhost:8000/api/reservas/${editandoId}/`, dataParaEnviar, config);
                alert('✅ Reserva actualizada');
            } else {
                await axios.post('http://localhost:8000/api/reservas/', dataParaEnviar, config);
                alert('✅ Reserva guardada');
            }
            window.location.reload(); 
        } catch (error) {
            alert('❌ Error en el servidor al procesar la reserva.');
        }
    };

    const styles = {
        mainWrapper: {
            minHeight: '90vh', boxSizing: 'border-box',
            backgroundImage: 'url("/reservas_coworking.avif")',
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
            position: 'relative', fontFamily: '"Inter", sans-serif',
            display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#333', overflowY: 'auto'
        },
        overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(1,2,3,0.5)', zIndex: 1 },
        contentContainer: {
            position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '80px', width: '95%', maxWidth: '1400px', transform: 'scale(0.8)', transformOrigin: 'center center' 
        },
        card: {
            backgroundColor: 'rgba(1,2,3,0.95)', padding: '35px', borderRadius: '8px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)', height: '85vh', display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
        },
        sectionTitle: { color: '#D3AC2C', fontSize: '26px', fontWeight: '600', marginBottom: '25px' },
        label: { fontWeight: '500', display: 'block', marginBottom: '10px', fontSize: '15px', color: '#B16C04' },
        input: {
            width: '100%', padding: '16px', marginBottom: '20px', borderRadius: '8px', boxSizing: 'border-box',
            fontSize: '16px', color: '#ffe48b', backgroundColor: '#3B3130', border: '2px solid #B16C04'
        },
        button: {
            width: '100%', padding: '18px', backgroundColor: '#B16C04', color: '#fff3cc', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '16px', marginTop: '10px'
        },
        btnDelete: { backgroundColor: '#e35f50', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' },
        btnEdit: { backgroundColor: '#ed9609', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }
    };

    return (
        <>
            <NavBar />
            <div style={styles.mainWrapper}>
                <div style={styles.overlay}></div>
                <div style={styles.contentContainer}>
                    
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>{editandoId ? "Editar Reserva" : "Nueva Reserva"}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                <div>
                                    <label style={styles.label}>Sede</label>
                                    <select style={styles.input} value={sedeSeleccionada} required onChange={e => {
                                        setSedeSeleccionada(e.target.value);
                                        setFormData({...formData, espacio: ''}); 
                                    }}>
                                        <option value="">-- Selecciona --</option>
                                        {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={styles.label}>Espacio</label>
                                    <select style={styles.input} required disabled={!sedeSeleccionada} value={formData.espacio} onChange={e => setFormData({...formData, espacio: e.target.value})}>
                                        <option value="">-- Selecciona --</option>
                                        {espaciosFiltrados.map(esp => <option key={esp.id} value={esp.id}>{esp.nombre}</option>)}
                                    </select>
                                </div>
                            </div>

                            <label style={styles.label}>Fecha</label>
                            <input type="date" style={styles.input} value={formData.fecha} required onChange={e => setFormData({...formData, fecha: e.target.value})} />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                                <input type="time" style={styles.input} value={formData.hora_inicio} required onChange={e => setFormData({...formData, hora_inicio: e.target.value})} />
                                <input type="time" style={styles.input} value={formData.hora_fin} required onChange={e => setFormData({...formData, hora_fin: e.target.value})} />
                            </div>

                            <button type="submit" style={styles.button}>{editandoId ? "Actualizar" : "Confirmar Reserva"}</button>
                            {editandoId && <button type="button" onClick={cancelarEdicion} style={{...styles.button, backgroundColor: '#555'}}>Cancelar</button>}
                        </form>
                    </div>

                    <div style={styles.card}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                            <h2 style={styles.sectionTitle}>Mis Reservas</h2>
                            <span style={{ fontSize: '13px', backgroundColor: '#420088', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>🧑‍💻 {userLabel}</span>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {reservas.map(r => {
                                const espacioDetalle = espacios.find(e => e.id === r.espacio);
                                return (
                                    <div key={r.id} style={{ padding: '20px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #B16C04' }}>
                                        <div style={{ fontSize: '18px', fontWeight: '600', color: '#ff7f24', marginBottom: '8px' }}>{obtenerInfoReserva(r.espacio)}</div>
                                        <div style={{ color: '#ffe5b4', marginBottom: '10px' }}>🗓️ {r.fecha} | 🕒 {r.hora_inicio.slice(0,5)} - {r.hora_fin.slice(0,5)}</div>
                                        <div style={{ fontSize: '13px', color: '#1b1b19', backgroundColor: '#b7bab4', padding: '4px 10px', borderRadius: '8px', display: 'inline-block', marginBottom: '10px' }}>
                                            👥 Capacidad: {espacioDetalle ? espacioDetalle.capacidad : '...'}
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => prepararEdicion(r)} style={styles.btnEdit}>Editar</button>
                                            <button onClick={() => eliminarReserva(r.id)} style={styles.btnDelete}>Eliminar</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReservasPage;

