// frontend/src/pages/SeatMapView.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Chip,
  TextField,
  CircularProgress,
  // Importaciones para la tabla de Manifiesto
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
} from "@mui/material"; 
import { getTripDetails, finalizeSale } from "../api/viajes"; 

// Función para simular un layout de bus (ej. 4xN)
const generateSeatLayout = (capacidad) => {
  const rows = Math.ceil(capacidad / 4);
  const layout = [];
  let seatNumber = 1;
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < 4; c++) {
      if (seatNumber <= capacidad) {
        // Simulación de pasillo entre columna 1 y 2
        if (c === 2) {
          row.push({ number: null, type: "pasillo" });
        }
        row.push({ number: seatNumber, type: "asiento" });
        seatNumber++;
      } else {
        row.push({ number: null, type: "vacio" });
      }
    }
    layout.push(row);
  }
  return layout;
};

function SeatMapView() {
  const { viajeId } = useParams();
  const navigate = useNavigate();
  const [viaje, setViaje] = useState(null);
  const [asientosOcupados, setAsientosOcupados] = useState(new Set());
  const [asientosSeleccionados, setAsientosSeleccionados] = useState(new Set());
  const [pasajerosData, setPasajerosData] = useState({}); // Nuevo: Estado para datos de pasajeros
  const [loading, setLoading] = useState(true);
  const [isSelling, setIsSelling] = useState(false); // Nuevo: Estado para indicar si se está procesando la venta

  const fetchTrip = async () => {
    const data = await getTripDetails(viajeId);
    if (data) {
      setViaje(data);
      // Seguridad: Asegurar que asientos_ocupados es un array
      const ocupados = new Set(
        (data.asientos_ocupados || []).map((a) => a.numero_asiento)
      );
      setAsientosOcupados(ocupados);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrip();
  }, [viajeId]);

  const toggleSeat = (number) => {
    if (asientosOcupados.has(number)) return;

    setAsientosSeleccionados((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
        // Si deseleccionamos, también borramos sus datos de pasajero
        setPasajerosData((p) => {
          // eslint-disable-next-line no-unused-vars
          const { [number]: _, ...rest } = p;
          return rest; // Borrado seguro
        });
      } else {
        newSet.add(number);
        // Si seleccionamos, inicializamos sus datos
        setPasajerosData((p) => ({
          ...p,
          [number]: {
            nombre_pasajero: "",
            dni_pasajero: "",
            numero_asiento: number,
            // Nota: El precio lo usará el backend, no hace falta pasarlo desde aquí
          },
        }));
      }
      return newSet;
    });
  };

  // Función para manejar el input del formulario de pasajero
  const handlePassengerChange = (seatNumber, field, value) => {
    setPasajerosData((prev) => ({
      ...prev,
      [seatNumber]: {
        ...prev[seatNumber],
        [field]: value,
        numero_asiento: seatNumber, // Se mantiene el número de asiento
      },
    }));
  };

  // Función para finalizar la venta
  const handleFinalizeSale = async () => {
    // Validación de datos mínimos
    const allDataValid = Array.from(asientosSeleccionados).every(
      (seat) =>
        pasajerosData[seat]?.nombre_pasajero &&
        pasajerosData[seat]?.dni_pasajero &&
        pasajerosData[seat].dni_pasajero.length >= 8
    );
    if (!allDataValid) {
      alert(
        "Por favor, complete el nombre y un DNI válido (mínimo 8 dígitos) para todos los asientos seleccionados."
      );
      return;
    }

    setIsSelling(true);

    // Preparar la data para el API
    const asientosAPIVenta = Array.from(asientosSeleccionados).map(
      (seatNumber) => pasajerosData[seatNumber]
    );

    const saleData = {
      viaje_id: viaje.id,
      asientos: asientosAPIVenta,
    };

    const result = await finalizeSale(saleData);
    setIsSelling(false);

    if (result.success) {
      alert(
        `✅ Venta #${
          result.data.id
        } realizada con éxito. Total: S/ ${result.data.total.toFixed(2)}`
      );
      // Redirigir al inicio de ventas
      navigate("/ventas", { replace: true });
    } else {
      // Manejo de errores
      const errorMsg = result.error.error || result.error.general || "Error desconocido.";
      alert(`❌ Error al procesar la venta: ${errorMsg}`);
      
      // Si hay un error de concurrencia o asientos no disponibles, recargar
      if (errorMsg.includes("Conflicto") || errorMsg.includes("asiento")) {
        fetchTrip();
        setAsientosSeleccionados(new Set());
        setPasajerosData({});
      }
    }
  };

  const seatLayout = viaje ? generateSeatLayout(viaje.bus.capacidad_total) : [];
  const totalSeleccionado =
    Array.from(asientosSeleccionados).length * (viaje?.precio_asiento || 0);

  if (loading)
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  if (!viaje)
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">Viaje no encontrado.</Typography>
      </Container>
    );

  // Determina si hay datos faltantes en el formulario de pasajeros
  const isFormIncomplete = Array.from(asientosSeleccionados).some(
    (seat) =>
      !pasajerosData[seat]?.nombre_pasajero ||
      pasajerosData[seat]?.dni_pasajero?.length < 8
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        onClick={() => navigate("/ventas")}
        variant="outlined"
        sx={{ mb: 2 }}
      >
        ← Volver a Búsqueda
      </Button>
      <Typography variant="h4" gutterBottom>
        Venta de Pasajes: {viaje.ruta?.ciudad_origen} →{" "}
        {viaje.ruta?.ciudad_destino}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Salida: **{viaje.fecha_salida}** a las **
        {viaje.hora_salida?.substring(0, 5)}** | Bus: **{viaje.bus?.placa}**
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Mapa de Asientos */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #ddd",
            }}
          >
            {/* ... (Bus layout rendering code) ... */}
            <Box sx={{ width: "100%", maxWidth: 400, p: 2 }}>
              {seatLayout.map((row, rowIndex) => (
                <Box
                  key={rowIndex}
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    mb: 1,
                  }}
                >
                  {row.map((item, colIndex) => {
                    if (item.type === "pasillo" || item.type === "vacio") {
                      return (
                        <Box
                          key={colIndex}
                          sx={{ width: 40, height: 40, m: 0.5 }}
                        />
                      );
                    }

                    const isOccupied = asientosOcupados.has(item.number);
                    const isSelected = asientosSeleccionados.has(item.number);

                    let color = "lightgray";
                    if (isOccupied) color = "red";
                    else if (isSelected) color = "green";

                    return (
                      <Button
                        key={item.number}
                        variant="contained"
                        disabled={isOccupied}
                        onClick={() => toggleSeat(item.number)}
                        sx={{
                          minWidth: 40,
                          height: 40,
                          m: 0.5,
                          backgroundColor: color,
                          "&:hover": {
                            backgroundColor: isOccupied ? "red" : "darkgreen",
                          },
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {item.number}
                      </Button>
                    );
                  })}
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Chip label="Disponible" sx={{ bgcolor: "lightgray", mr: 1 }} />
              <Chip
                label="Ocupado"
                sx={{ bgcolor: "red", mr: 1, color: "white" }}
              />
              <Chip
                label="Seleccionado"
                sx={{ bgcolor: "green", mr: 1, color: "white" }}
              />
            </Box>
          </Paper>
          
          {/* ======================================================= */}
          {/* 🎯 AÑADIDO: MANIFIESTO DE PASAJEROS (Reporte de Carga)  */}
          {/* ======================================================= */}
          {(viaje.asientos_ocupados?.length > 0) && (
              <TableContainer component={Paper} sx={{ mt: 4, mb: 4 }}>
                  <Typography variant="h6" component="div" sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                      Reporte de Carga y Pasajeros ({viaje.asientos_ocupados.length} Asientos Ocupados)
                  </Typography>
                  <Table size="small">
                      <TableHead>
                          <TableRow>
                              <TableCell sx={{ fontWeight: 'bold' }}>Asiento</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>Pasajero</TableCell>
                              <TableCell sx={{ fontWeight: 'bold' }}>DNI</TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Precio Pagado</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {viaje.asientos_ocupados
                              .sort((a, b) => a.numero_asiento - b.numero_asiento)
                              .map((asiento) => (
                                  <TableRow key={asiento.numero_asiento}>
                                      <TableCell>{asiento.numero_asiento}</TableCell>
                                      <TableCell>{asiento.nombre_pasajero || 'N/A'}</TableCell>
                                      <TableCell>{asiento.dni_pasajero || 'N/A'}</TableCell>
                                      <TableCell align="right">S/ {parseFloat(asiento.precio_pagado || 0).toFixed(2)}</TableCell>
                                  </TableRow>
                              ))}
                      </TableBody>
                  </Table>
              </TableContainer>
          )}

        </Grid>

        {/* Resumen y Formulario de Pasajeros */}
        <Grid item xs={12} md={6}>
          {/* Resumen */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Detalle del Pedido
            </Typography>
            <Typography>
              Asientos: **
              {Array.from(asientosSeleccionados).join(", ") || "Ninguno"}**
            </Typography>
            <Typography>Cantidad: **{asientosSeleccionados.size}**</Typography>
            <Typography>
              Precio por Asiento: **S/ {viaje.precio_asiento}**
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
              Total a Pagar: **S/ {totalSeleccionado.toFixed(2)}**
            </Typography>
          </Paper>

          {/* Formulario de Datos de Pasajeros */}
          {asientosSeleccionados.size > 0 && (
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Datos de Pasajeros
              </Typography>
              {Array.from(asientosSeleccionados).map((seatNumber) => (
                <Box
                  key={seatNumber}
                  sx={{
                    mb: 2,
                    border: "1px solid #eee",
                    p: 1,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Asiento #{seatNumber}
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        required
                        label="Nombre Completo"
                        size="small"
                        sx={{ mb: 1 }}
                        value={pasajerosData[seatNumber]?.nombre_pasajero || ""}
                        onChange={(e) =>
                          handlePassengerChange(
                            seatNumber,
                            "nombre_pasajero",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        required
                        label="DNI / Cédula (min 8)"
                        size="small"
                        type="number"
                        // inputProps={{ maxLength: 8 }} // Ojo: maxlength en type="number" puede no funcionar en todos los navegadores
                        value={pasajerosData[seatNumber]?.dni_pasajero || ""}
                        onChange={(e) =>
                          handlePassengerChange(
                            seatNumber,
                            "dni_pasajero",
                            e.target.value
                          )
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={handleFinalizeSale}
                disabled={isSelling || isFormIncomplete}
                sx={{ mt: 2 }}
              >
                {isSelling ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  `Confirmar Venta (S/ ${totalSeleccionado.toFixed(2)})`
                )}
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default SeatMapView;