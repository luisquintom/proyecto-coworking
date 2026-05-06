import React, {useEffect} from 'react';
import {useNavigate} from "react-router";

export default function NavBar() {
    let navigate = useNavigate();
    if(!localStorage.getItem('token')) {
        navigate("/");
    }

    useEffect(() => {}, []);
    return(
        <nav style={{ padding: '10px', backgroundColor: '#1D1D1F', textAlign: 'right', }}>
    <button
        onClick={() => {
            localStorage.removeItem('token');
            navigate("/");
        }}
        style={{ color: '#B16C04',
            background: 'none',
            border: '1px solid #B16C04',
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '8px',
        }}
    >
        Cerrar Sesión
    </button>
</nav>)}