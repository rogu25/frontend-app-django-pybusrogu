// frontend/src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // URL de tu Backend

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}token/login/`, {
            username,
            password,
        });
        // Guarda el token para usarlo en futuras peticiones
        localStorage.setItem('authToken', response.data.auth_token);
        return true; // Login exitoso
    } catch (error) {
        console.error("Login fallido:", error.response ? error.response.data : error.message);
        return false; // Login fallido
    }
};

/**
 * Cierra la sesión de forma segura, invalidando el token en el backend
 * y limpiando el almacenamiento local.
 */
export const logout = async () => {
    // 1. Llama al endpoint de logout del backend para invalidar el token.
    try {
        // Usamos null como cuerpo de la petición POST, ya que no se envían datos.
        await axios.post(`${API_URL}token/logout/`, null, getConfig());
    } catch (error) {
        // Si hay un error (ej. el token ya expiró o es inválido),
        // simplemente limpiamos localmente, ya que la meta es cerrar la sesión.
        console.warn("Error al invalidar token en el backend. Procediendo a cerrar sesión localmente.", error);
    }

    // 2. Limpia el token de forma local (siempre debe hacerse)
    localStorage.removeItem('authToken');
    
    // Retornamos true (o nada) para que el frontend pueda redirigir al usuario.
    return true; 
};

// Función auxiliar para obtener la configuración de headers con el token.
// Se usa en llamadas que requieren autenticación (como el logout).
const getConfig = () => {
    const token = localStorage.getItem('authToken');
    return {
        headers: {
            // DRF/Djoser requiere el prefijo 'Token '
            'Authorization': `Token ${token}`
        }
    };
};