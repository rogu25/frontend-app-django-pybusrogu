import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Paper,
    MenuItem,
    Card,             // Nuevo componente para los resultados
    CardContent,
    CardActions,
    Chip,             // Nuevo componente para tags de información
    CircularProgress, // Para la carga
    Alert,            // Para mensajes de error o vacío
} from "@mui/material";
import { Search as SearchIcon, BusAlert, Route, Timer, AttachMoney } from "@mui/icons-material";
import { getCities, searchTrips } from "../api/viajes";
import { useNavigate, Link } from "react-router-dom";

// 💡 Helper para formatear la fecha a YYYY-MM-DD
const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

function SalesView() {
    const [ciudades, setCiudades] = useState({ origenes: [], destinos: [] });
    const [search, setSearch] = useState({ origen: "", destino: "", fecha: formatDate(new Date()) }); // Inicializa la fecha a hoy
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true); // Para saber si es la primera carga
    const navigate = useNavigate();

    useEffect(() => {
        // Carga las listas de ciudades e inicia la primera búsqueda
        const fetchData = async () => {
            try {
                // 1. Cargar ciudades
                const cityData = await getCities();
                setCiudades(cityData);
                
                // 2. Ejecutar búsqueda inicial (viajes de hoy)
                const initialResults = await searchTrips(search);
                setViajes(initialResults);
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            } finally {
                setLoading(false);
                setInitialLoad(false);
            }
        };
        setLoading(true);
        fetchData();
    }, []); // Se ejecuta solo una vez al montar

    const handleSearch = async () => {
        setLoading(true);
        setInitialLoad(false);
        try {
            const results = await searchTrips(search);
            setViajes(results);
        } catch (error) {
            console.error("Error al buscar viajes:", error);
            setViajes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTrip = (viajeId) => {
        navigate(`/ventas/asientos/${viajeId}`);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
            {/* Cabecera y Título Profesional */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                sx={{ borderBottom: '2px solid #ddd', pb: 1 }} // Separador visual
            >
                <Typography variant="h3" component="h1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Punto de Venta Central
                </Typography>
                <Link to="/historial" style={{ textDecoration: "none" }}>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        startIcon={<BusAlert />}
                        sx={{ borderRadius: 2 }}
                    >
                        Historial de Ventas
                    </Button>
                </Link>
            </Box>

            {/* Formulario de Búsqueda con Estilo de Tarjeta */}
            <Paper elevation={6} sx={{ p: 4, mb: 5, borderRadius: 3, background: '#f5f7fa' }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
                    <SearchIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Filtro Rápido de Viajes
                </Typography>

                <Grid container spacing={3} alignItems="flex-end">
                    <Grid item xs={12} md={3}>
                        <TextField
                            select
                            fullWidth
                            label="Ciudad Origen"
                            value={search.origen}
                            onChange={(e) => setSearch({ ...search, origen: e.target.value })}
                            variant="outlined"
                            size="medium"
                        >
                            <MenuItem value="">-- Todas --</MenuItem>
                            {ciudades.origenes.map((c) => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            select
                            fullWidth
                            label="Ciudad Destino"
                            value={search.destino}
                            onChange={(e) => setSearch({ ...search, destino: e.target.value })}
                            variant="outlined"
                            size="medium"
                        >
                            <MenuItem value="">-- Todas --</MenuItem>
                            {ciudades.destinos.map((c) => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Fecha de Viaje"
                            type="date"
                            value={search.fecha}
                            onChange={(e) => setSearch({ ...search, fecha: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            variant="outlined"
                            size="medium"
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSearch}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                            fullWidth
                            sx={{ height: 56, borderRadius: 2 }} // Altura ajustada a TextField size="medium"
                        >
                            {loading ? 'Buscando...' : 'Buscar Viajes'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Resultados Dinámicos (Card View) */}
            <Typography variant="h4" gutterBottom sx={{ mt: 5, mb: 3, fontWeight: 600 }}>
                Viajes Encontrados ({viajes.length})
            </Typography>

            {initialLoad ? (
                 <Alert severity="info" variant="outlined" sx={{ mt: 3, py: 2 }}>
                    Cargando datos iniciales y viajes para hoy...
                </Alert>
            ) : loading ? (
                <Box display="flex" justifyContent="center" py={5}>
                    <CircularProgress size={50} />
                </Box>
            ) : viajes.length === 0 ? (
                <Alert severity="warning" variant="filled" sx={{ mt: 3, py: 2 }}>
                    No se encontraron viajes que coincidan con los criterios de búsqueda.
                </Alert>
            ) : (
                <Grid container spacing={4}>
                    {viajes.map((viaje) => (
                        <Grid item xs={12} sm={6} lg={4} key={viaje.id}>
                            <Card elevation={4} sx={{ borderRadius: 3, borderLeft: '5px solid #1976d2' }}>
                                <CardContent>
                                    {/* Ruta principal destacada */}
                                    <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 700 }}>
                                        <Route sx={{ verticalAlign: 'middle', mr: 1, color: '#1976d2' }} />
                                        {viaje.ruta?.ciudad_origen} → {viaje.ruta?.ciudad_destino}
                                    </Typography>

                                    {/* Precio grande y visible */}
                                    <Typography variant="h4" color="text.primary" sx={{ mb: 2, fontWeight: 700, color: '#388e3c' }}>
                                        <AttachMoney sx={{ verticalAlign: 'middle', fontSize: '1.2em' }} />
                                        S/ {viaje.precio_asiento}
                                    </Typography>
                                    
                                    {/* Chips de información secundaria */}
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                        <Chip 
                                            icon={<Timer />} 
                                            label={`${viaje.fecha_salida} | ${viaje.hora_salida.substring(0, 5)}`} 
                                            color="info" 
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip 
                                            icon={<BusAlert />} 
                                            label={`Bus: ${viaje.bus?.placa}`} 
                                            color="default" 
                                            size="small"
                                        />
                                        <Chip 
                                            label={`Capacidad: ${viaje.bus?.capacidad_total} Asientos`} 
                                            color="default" 
                                            size="small"
                                        />
                                    </Box>

                                    <Typography variant="body2" color="text.secondary">
                                        Ruta: {viaje.ruta.nombre}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={() => handleSelectTrip(viaje.id)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Vender Asientos
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default SalesView;