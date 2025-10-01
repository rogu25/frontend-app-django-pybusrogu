// frontend/src/api/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // URL de tu Backend

// 🎯 CAMBIO CLAVE: getConfig AHORA ACEPTA EL TOKEN COMO PARÁMETRO
const getConfig = (token) => {
    // Si se pasa un token, lo usa. Si no, lee del localStorage (útil para otras funciones)
    const activeToken = token || localStorage.getItem('authToken'); 
    
    if (!activeToken) {
        // Podrías lanzar un error aquí si el token es nulo
        return {};
    }
    
    return {
        headers: {
            'Authorization': `Token ${activeToken}`
        }
    };
};

/**
 * Llama a la API para obtener los datos del usuario actual (el vendedor).
 * 🎯 AHORA ACEPTA EL TOKEN COMO ARGUMENTO
 */
const getMe = async (token) => {
    // Usamos el token que acabamos de obtener del login
    const response = await axios.get(`${API_URL}users/me/`, getConfig(token)); 
    return response.data; 
};


export const login = async (username, password) => {
    // 1. Ejecuta el login para obtener el token
    const response = await axios.post(`${API_URL}token/login/`, {
        username,
        password,
    });
    
    const token = response.data.auth_token;
    localStorage.setItem('authToken', token);

    // 2. 🎯 CRÍTICO: Llama a getMe PASANDO EL TOKEN directamente.
    try {
        const userData = await getMe(token); 
        
        // 3. Guardar el nombre de usuario. 
        //    Asumimos que Djoser devuelve el campo 'username'.
        localStorage.setItem('user_username', userData.username);
        
        console.log("Nombre de usuario guardado:", userData.username); // Verifica en consola
        
    } catch (error) {
        // Si el /users/me/ falla, logueamos el error pero permitimos continuar.
        console.error("Error al obtener datos del usuario /users/me/. Verifique que el token esté funcionando y que /users/me/ esté configurado.", error.response ? error.response.data : error.message);
    }
    
    return true; 
};

/**
 * Cierra la sesión de forma segura.
 */
export const logout = async () => {
    try {
        // Aquí no pasamos token porque usa el que está en localStorage, que es el que se quiere invalidar.
        await axios.post(`${API_URL}token/logout/`, null, getConfig()); 
    } catch (error) {
        console.warn("Error al invalidar token en el backend. Procediendo a cerrar sesión localmente.", error);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('user_username'); 
    
    return true; 
};

// ... (exportaciones si las tienes)