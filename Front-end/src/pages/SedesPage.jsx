import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const SedesPage = () => {
    const [sedes, setSedes] = useState([]);

    useEffect(() => {
        api.get('sedes/')
            .then(response => setSedes(response.data))
            .catch(error => console.error("Error cargando sedes:", error));
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Nuestras Sedes de Coworking</h1>
            <div style={{ display: 'grid', gap: '20px' }}>
                {sedes.map(sede => (
                    <div key={sede.id} style={{ 
                        border: '1px solid #ccc', 
                        padding: '15px', 
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9'
                    }}>
                        <h2 style={{ margin: '0 0 10px 0' }}>{sede.nombre}</h2>
                        <p>📍 {sede.ubicacion}</p>
                        <button style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Ver Espacios
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SedesPage;