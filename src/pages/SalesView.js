import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem,
} from "@mui/material";
import { getCities, searchTrips } from "../api/viajes";
import { useNavigate, Link } from "react-router-dom";

function SalesView() {
    const [ciudades, setCiudades] = useState({ origenes: [], destinos: [] });
    const [search, setSearch] = useState({ origen: "", destino: "", fecha: "" });
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Carga las listas de ciudades al iniciar
        const fetchCities = async () => {
            const data = await getCities();
            setCiudades(data);
        };
        fetchCities();
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        const results = await searchTrips(search);
        setViajes(results);
        setLoading(false);
    };

    const handleSelectTrip = (viajeId) => {
        // Redirige al mapa de asientos
        navigate(`/ventas/asientos/${viajeId}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Punto de Venta de Pasajes
                </Typography>
                
                {/* 🎯 CORRECCIÓN UX: Enlace al Historial movido aquí */}
                <Link to="/historial" style={{ textDecoration: 'none' }}>
                    <Button variant="outlined" size="small" color="secondary">
                        Historial de Ventas 📋
                    </Button>
                </Link>
            </Box>

            {/* Formulario de Búsqueda */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Buscar Viajes
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Ciudad Origen"
                            value={search.origen}
                            onChange={(e) => setSearch({ ...search, origen: e.target.value })}
                        >
                            <MenuItem value="">-- Cualquiera --</MenuItem>
                            {ciudades.origenes.map((c) => (
                                <MenuItem key={c} value={c}>
                                    {c}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Ciudad Destino"
                            value={search.destino}
                            onChange={(e) =>
                                setSearch({ ...search, destino: e.target.value })
                            }
                        >
                            <MenuItem value="">-- Cualquiera --</MenuItem>
                            {ciudades.destinos.map((c) => (
                                <MenuItem key={c} value={c}>
                                    {c}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            fullWidth
                            label="Fecha de Salida"
                            type="date"
                            value={search.fecha}
                            onChange={(e) => setSearch({ ...search, fecha: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={1}
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={loading}
                            fullWidth
                            // El botón de búsqueda solo se habilita si hay al menos un filtro activo (opcional)
                            // disabled={loading || !(search.origen || search.destino || search.fecha)}
                        >
                            Buscar
                        </Button>
                    </Grid>
                    {/* El antiguo enlace al historial fue eliminado de aquí */}
                </Grid>
            </Paper>

            {/* Tabla de Resultados */}
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Resultados ({viajes.length})
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ruta</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Hora</TableCell>
                            <TableCell>Bus</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6}>Cargando...</TableCell>
                            </TableRow>
                        ) : viajes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    No se encontraron viajes disponibles.
                                </TableCell>
                            </TableRow>
                        ) : (
                            viajes.map((viaje) => (
                                <TableRow key={viaje.id} hover>
                                    <TableCell>
                                        {viaje.ruta?.ciudad_origen} → {viaje.ruta?.ciudad_destino}
                                    </TableCell>
                                    <TableCell>{viaje.fecha_salida}</TableCell>
                                    <TableCell>{viaje.hora_salida.substring(0, 5)}</TableCell>
                                    <TableCell>
                                        {viaje.bus?.placa} ({viaje.bus?.capacidad_total} Asientos)
                                    </TableCell>
                                    <TableCell>S/ {viaje.precio_asiento}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleSelectTrip(viaje.id)}
                                        >
                                            Vender Asientos
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default SalesView;