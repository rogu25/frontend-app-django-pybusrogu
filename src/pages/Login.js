import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let errors = {};
    if (!username.trim()) {
      errors.username = "El nombre de usuario es obligatorio.";
    }
    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setError(null);
    setLoading(true);
    // Limpiamos los errores de validación antes del intento de API
    setValidationErrors({});

    try {
      await login(username, password);
      navigate("/ventas", { replace: true });
    } catch (err) {
      console.log('Error capturado:', err)
      // 🎯 Manejo de error de la API: DRF/Djoser devuelve 400 Bad Request
      const apiErrorMessage = "Credenciales incorrectas. Verifique sus datos.";

      // 1. Mostrar el mensaje en la alerta general
      setError(apiErrorMessage);

      // 2. Marcar ambos campos como inválidos para feedback visual
      setValidationErrors({
        username: apiErrorMessage,
        password: apiErrorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper para limpiar el error de validación cuando el usuario empieza a escribir.
  const handleFieldChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => ({ ...prev, [fieldName]: null }));
    }
    // También limpiamos el error general de la alerta si el usuario intenta corregir
    if (error) {
      setError(null);
    }
  };

  return (
    <Box
      // ... (Estilos de fondo y centrado)
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f2f5 0%, #e0e4eb 100%)",
        p: 2,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: "white",
            transition: "0.3s",
            "&:hover": {
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ mb: 1, fontWeight: 700, color: "#1976d2" }}
            >
              PyBus-Rogu
            </Typography>

            <Typography
              component="p"
              variant="subtitle1"
              sx={{ mb: 3, color: "#666" }}
            >
              Acceso de Empleados
            </Typography>

            {/* 1. Alerta General */}
            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Nombre de Usuario"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={handleFieldChange(setUsername, "username")}
                variant="outlined"
                size="medium"
                // 2. Feedback en el campo: `error` y `helperText`
                error={!!validationErrors.username}
                helperText={validationErrors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleFieldChange(setPassword, "password")}
                variant="outlined"
                size="medium"
                // 2. Feedback en el campo: `error` y `helperText`
                error={!!validationErrors.password}
                helperText={validationErrors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Ingresar al Sistema"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
