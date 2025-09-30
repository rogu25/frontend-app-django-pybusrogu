import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Función auxiliar para obtener el token de autenticación
const getConfig = () => ({
  headers: {
    // DRF/Djoser requiere el prefijo 'Token '
    'Authorization': `Token ${localStorage.getItem('authToken')}`
  }
});

// =======================================================
// FUNCIONES DE BÚSQUEDA Y DETALLE DE VIAJES
// =======================================================

export const getCities = async () => {
  try {
    const response = await axios.get(`${API_URL}rutas/ciudades/`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
    return { origenes: [], destinos: [] };
  }
};

export const searchTrips = async ({ origen, destino, fecha }) => {
  try {
    const params = {
      ruta__ciudad_origen: origen,
      ruta__ciudad_destino: destino,
      fecha_salida: fecha,
    };
    // Filtramos para enviar solo los parámetros que tienen valor
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v)
    );

    const response = await axios.get(`${API_URL}viajes/`, {
        ...getConfig(),
        params: filteredParams
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar viajes:", error.response ? error.response.data : error.message);
    return [];
  }
};

export const getTripDetails = async (viajeId) => {
  try {
    const response = await axios.get(`${API_URL}viajes/${viajeId}/`, getConfig()); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del viaje:", error);
    return null;
  }
};

// =======================================================
// FUNCIONES DE VENTA Y REPORTE
// =======================================================

export const finalizeSale = async (saleData) => {
  try {
    const response = await axios.post(`${API_URL}ventas/`, saleData, getConfig());
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error al finalizar la venta:", error.response ? error.response.data : error.message);
    // Devuelve el error del backend para mostrar un mensaje útil
    return { success: false, error: error.response?.data || { general: "Error de conexión o datos inválidos." } };
  }
};

export const getSalesHistory = async () => {
  try {
    // Llama al endpoint 'historial-ventas' para el listado GET de las ventas del usuario
    const response = await axios.get(`${API_URL}historial-ventas/`, getConfig());
    return response.data;
  } catch (error) {
    console.error("Error al obtener el historial de ventas:", error.response ? error.response.data : error.message);
    // Si falla (ej. 401/403), devolvemos un array vacío
    return []; 
  }
};