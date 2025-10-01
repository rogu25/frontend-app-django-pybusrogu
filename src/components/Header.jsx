import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../api/auth";
import {
  Home,
  History,
  Assessment,
  Logout,
  AccountCircle,
} from "@mui/icons-material";

function Header() {
  // Renombrado a Header
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 Lectura del nombre de usuario desde localStorage
  const username = localStorage.getItem("user_username") || "Vendedor";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Define los enlaces y sus iconos
  const navLinks = [
    { path: "/ventas", label: "Ventas", icon: <Home /> },
    { path: "/historial", label: "Historial", icon: <History /> },
    { path: "/reportes", label: "Reportes", icon: <Assessment /> },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" elevation={4}>
        <Toolbar>
          {/* Branding - PyBus-Rogu */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: 1.5,
            }}
            onClick={() => navigate("/ventas")}
          >
            PYBUS-ROGU
          </Typography>

          {/* Contenedor de Enlaces de Navegación */}
          <Box sx={{ display: { xs: "none", md: "flex" }, mr: 3 }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                color="inherit"
                startIcon={link.icon}
                onClick={() => navigate(link.path)}
                sx={{
                  mx: 1,
                  fontWeight: 600,
                  py: 1,
                  borderBottom: location.pathname.startsWith(link.path)
                    ? "3px solid white"
                    : "none",
                  borderRadius: 0,
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Separador */}
          <Box
            sx={{
              borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
              height: 30,
              mx: 2,
            }}
          />

          {/* Información del Usuario y Logout */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AccountCircle sx={{ mr: 1, fontSize: 30 }} />

            {/* 🎯 Muestra el nombre de usuario */}
            <Typography sx={{ mr: 2, fontWeight: 500 }}>
              Cajero: **{username}**
            </Typography>

            <Button
              color="error"
              variant="contained"
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{ borderRadius: 2 }}
            >
              Salir
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
