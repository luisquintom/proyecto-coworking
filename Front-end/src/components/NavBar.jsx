import React, {useEffect} from 'react';
import {useNavigate} from "react-router";

export default function NavBar() {
    let navigate = useNavigate();
    if(!localStorage.getItem('token')) {
        console.log("eyyyy");

        navigate("/");
    }

    useEffect(() => {

    }, []);
    return(
        <nav style={{ padding: '10px', backgroundColor: '#2c3e50', textAlign: 'right', }}>
    <button
        onClick={() => {
            localStorage.removeItem('token');
            navigate("/");
        }}
        style={{ color: 'white',
            background: 'none',
            border: '1px solid white',
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '4px',
        }}
    >
        Cerrar Sesión
    </button>
</nav>)}