import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth'; // Importamos la función de logout

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Llama a la función de logout (invalida token en backend y limpia localStorage)
        await logout();
        // Redirige al usuario a la página de inicio de sesión
        navigate('/', { replace: true });
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    PyBus-Rogu | Sistema de Ventas
                </Typography>
                
                <Box sx={{ flexGrow: 1 }}>
                    {/* Aquí podríamos añadir enlaces de navegación si fueran más complejos */}
                </Box>

                <Button color="inherit" onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;