// Necesitará importar estos iconos de @mui/icons-material
import {
  Tv,
  Wc,
  MeetingRoom,
  Luggage,
  DirectionsBus,
  ArrowBack,
  EventSeat,
  Group,
  CreditCard,
  Warning,
  AirlineSeatReclineNormal,
} from "@mui/icons-material";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  CircularProgress,
  Alert,
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Chip,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";

import { getTripDetails, finalizeSale } from "../api/viajes";
import BusSeatLayout from "../components/Bus_create";
import BusSeatingLayout from "../components/BusSeatingLayout";

const SEAT_SIZE = "30px"; // Tamaño ajustado para encajar en el layout exacto
const SEAT_SIZE_H = "50px";
const SEAT_SIZE_V = "30px";

const SEAT_COLORS = {
  DISPONIBLE: "#17b722ff", // Verde claro (disponible)
  OCUPADO: "#f54545ff", // Rojo claro (ocupado)
  SELECCIONADO: "#6e7272ff", // Verde esmeralda (seleccionado)
  FONDO_PISO: "#F3F4F6",
  FONDO_BUS: "#FFFFFF",
  BORDE_PISO: "#D1D5DB",
  VENTANA: "#7c7d7eff", // Gris claro para el indicador 'V'
  RESERVA: "#e0d952ff", // color de reserva(leyenda)
};

// Componente de Asiento Moderno (Limpio)
const SeatComponent = ({ number, estado, isSelected, onClick, isWindow }) => {
  const isAvailable = estado !== "ocupado";
  const bgColor = isSelected
    ? SEAT_COLORS.SELECCIONADO
    : isAvailable
    ? SEAT_COLORS.DISPONIBLE
    : SEAT_COLORS.OCUPADO;
  const textColor = isSelected ? "white" : isAvailable ? "#065F46" : "#991B1B";
  const icono_seat = <AirlineSeatReclineNormal  fontSize="small"/>

  // Componente para elementos de servicio (simplificado)
  const ServiceElement = ({ label, icon, size = SEAT_SIZE }) => (
    <Box
      sx={{
        width: size,
        height: size,
        m: 0.5,
        bgcolor: SEAT_COLORS.FONDO_PISO,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.6rem",
        color: "#4B5563",
        border: "1px dashed #9CA3AF",
      }}
      title={label}
    >
      {icon}
      <Typography
        variant="caption"
        sx={{ lineHeight: 1, fontSize: "0.55rem", fontWeight: 600, mt: -0.5 }}
      >
        {label}
      </Typography>
    </Box>
  );

  // Renderiza elementos de servicio (simplificado, incluyendo el 'V' de la imagen)
  if (number === "V") {
    return (
      <Box
        sx={{
          width: "10px", // Ancho muy reducido
          height: SEAT_SIZE,
          m: 0.4,
          bgcolor: SEAT_COLORS.VENTANA,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.6rem",
          color: "white",
          fontWeight: "bold",
        }}
        title="Ventana Lateral"
      >
        V
      </Box>
    );
  }
  if (number === "TV") {
    return (
      <ServiceElement
        label="TV"
        icon={<Tv sx={{ fontSize: 16 }} />}
        size={SEAT_SIZE}
      />
    );
  }
  if (number === "WC") {
    return (
      <ServiceElement
        label="WC"
        icon={<Wc sx={{ fontSize: 16 }} />}
        size={SEAT_SIZE}
      />
    );
  }
  if (number === "PUERTA") {
    return (
      <ServiceElement
        label="PUERTA"
        icon={<MeetingRoom sx={{ fontSize: 16 }} />}
        size={SEAT_SIZE}
      />
    );
  }
  if (number === "MALETERO") {
    return (
      <ServiceElement
        label="MALETERO"
        icon={<Luggage sx={{ fontSize: 16 }} />}
        size={SEAT_SIZE}
      />
    );
  }
  if (number === "CONDUCTOR") {
    return (
      <ServiceElement
        label="CHÓFER"
        icon={<DirectionsBus sx={{ fontSize: 16 }} />}
        size={SEAT_SIZE}
      />
    );
  }

  // Renderiza Asiento
  return (
    <Box
      onClick={() => isAvailable && onClick(number)}
      title={`Asiento ${number} - ${estado}`}
      sx={{
        width: SEAT_SIZE_H,
        height: SEAT_SIZE_V,
        m: 0.5,
        cursor: isAvailable ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        borderRadius: 2,
        boxShadow: isSelected
          ? "0 0 10px rgba(16, 185, 129, 0.8)"
          : "0 2px 4px rgba(0,0,0,0.1)",
        transition: "all 0.2s",
        fontWeight: "bold",
        color: textColor,
        fontSize: "0.9rem",
        "&:hover": {
          transform: isAvailable ? "scale(1.05)" : "none",
          boxShadow: isAvailable
            ? "0 4px 8px rgba(0,0,0,0.15)"
            : "0 2px 4px rgba(0,0,0,0.1)",
        },
      }}
    >
      {icono_seat}
      {number}
    </Box>
  );
};

// Layout exacto basado en la imagen del bus Modasa Zeus (60 asientos)
const generateModasaZeusLayoutExact = (asientosOcupados) => {
  // La estructura de la imagen tiene un ancho de 7 elementos

  // Función auxiliar para crear un asiento
  const createSeat = (number) => ({
    number: String(number), // Aseguramos que sea string
    type: "asiento",
    estado: asientosOcupados.has(String(number)) ? "ocupado" : "disponible",
  });
  // Función auxiliar para crear un pasillo
  const Pasillo = () => ({ type: "pasillo", number: " " });

  // ----------------------------------------------------
  // PISO 2 (SEGUNDO PISO): Asientos 1 a 44 (11 filas de 4)
  // ----------------------------------------------------
  const busStructurePiso2 = [
    // Fila 1: Asientos 1-4
    [
      { type: "servicio", number: "V" },
      createSeat(1),
      createSeat(2),
      Pasillo(),
      createSeat(3),
      createSeat(4),
      { type: "servicio", number: "V" },
    ],
    // Fila 2: Separador TV
    [
      Pasillo(),
      Pasillo(),
      Pasillo(),
      { type: "servicio", number: "TV" },
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
    // Fila 3: Asientos 5-8
    [
      { type: "servicio", number: "V" },
      createSeat(5),
      createSeat(6),
      Pasillo(),
      createSeat(7),
      createSeat(8),
      { type: "servicio", number: "V" },
    ],
    // Fila 4: Asientos 9-12
    [
      { type: "servicio", number: "V" },
      createSeat(9),
      createSeat(10),
      Pasillo(),
      createSeat(11),
      createSeat(12),
      { type: "servicio", number: "V" },
    ],
    // Fila 5: Separador TV
    [
      Pasillo(),
      Pasillo(),
      Pasillo(),
      { type: "servicio", number: "TV" },
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
    // Fila 6: Asientos 13-16
    [
      { type: "servicio", number: "V" },
      createSeat(13),
      createSeat(14),
      Pasillo(),
      createSeat(15),
      createSeat(16),
      { type: "servicio", number: "V" },
    ],
    // Fila 7: Asientos 17-20
    [
      { type: "servicio", number: "V" },
      createSeat(17),
      createSeat(18),
      Pasillo(),
      createSeat(19),
      createSeat(20),
      { type: "servicio", number: "V" },
    ],
    // Fila 8: Separador TV
    [
      Pasillo(),
      Pasillo(),
      Pasillo(),
      { type: "servicio", number: "TV" },
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
    // Fila 9: Asientos 21-24
    [
      { type: "servicio", number: "V" },
      createSeat(21),
      createSeat(22),
      Pasillo(),
      createSeat(23),
      createSeat(24),
      { type: "servicio", number: "V" },
    ],
    // Fila 10: Asientos 25-28
    [
      { type: "servicio", number: "V" },
      createSeat(25),
      createSeat(26),
      Pasillo(),
      createSeat(27),
      createSeat(28),
      { type: "servicio", number: "V" },
    ],
    // Fila 11: Separador TV
    [
      Pasillo(),
      Pasillo(),
      Pasillo(),
      { type: "servicio", number: "TV" },
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
    // Fila 12: Asientos 29-32
    [
      { type: "servicio", number: "V" },
      createSeat(29),
      createSeat(30),
      Pasillo(),
      createSeat(31),
      createSeat(32),
      { type: "servicio", number: "V" },
    ],
    // Fila 13: Asientos 33-36
    [
      { type: "servicio", number: "V" },
      createSeat(33),
      createSeat(34),
      Pasillo(),
      createSeat(35),
      createSeat(36),
      { type: "servicio", number: "V" },
    ],
    // Fila 14: Separador TV
    [
      Pasillo(),
      Pasillo(),
      Pasillo(),
      { type: "servicio", number: "TV" },
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
    // Fila 15: Asientos 37-40
    [
      { type: "servicio", number: "V" },
      createSeat(37),
      createSeat(38),
      Pasillo(),
      createSeat(39),
      createSeat(40),
      { type: "servicio", number: "V" },
    ],
    // Fila 16: Asientos 41-44 (Final)
    [
      { type: "servicio", number: "V" },
      createSeat(41),
      createSeat(42),
      Pasillo(),
      createSeat(43),
      createSeat(44),
      { type: "servicio", number: "V" },
    ],
  ];

  // ----------------------------------------------------
  // PISO 1 (PLANTA BAJA): Asientos 45 a 60 (16 asientos)
  // ----------------------------------------------------
  const busStructurePiso1 = [
    // Fila 1: (Frente - Conductor / WC)
    [
      { type: "servicio", number: "CONDUCTOR" },
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
    // Fila 2: WC y Puerta
    [
      Pasillo(),
      Pasillo(),
      { type: "servicio", number: "WC" },
      Pasillo(),
      Pasillo(),
      { type: "servicio", number: "PUERTA" },
      Pasillo(),
    ],
    // Fila 3: Espacio de transición / Escalera
    [
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
    // Fila 4: Asientos 45-48 (3 asientos)
    [
      { type: "servicio", number: "V" },
      createSeat(45),
      createSeat(46),
      Pasillo(),
      createSeat(47),
      createSeat(48),
      { type: "servicio", number: "V" },
    ],
    // Fila 5: Asientos 49-52
    [
      { type: "servicio", number: "V" },
      createSeat(49),
      createSeat(50),
      Pasillo(),
      createSeat(51),
      createSeat(52),
      { type: "servicio", number: "V" },
    ],
    // Fila 6: Asientos 53-56
    [
      { type: "servicio", number: "V" },
      createSeat(53),
      createSeat(54),
      Pasillo(),
      createSeat(55),
      createSeat(56),
      { type: "servicio", number: "V" },
    ],
    // Fila 7: Asientos 57-60
    [
      { type: "servicio", number: "V" },
      createSeat(57),
      createSeat(58),
      Pasillo(),
      createSeat(59),
      createSeat(60),
      { type: "servicio", number: "V" },
    ],
    // Fila 8: Maletero
    [
      { type: "servicio", number: "MALETERO" },
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
      Pasillo(),
    ],
  ];

  return {
    piso1: busStructurePiso1,
    piso2: busStructurePiso2,
  };
};

// ====================================================================
// COMPONENTE PRINCIPAL (FUSIONADO Y CON LAYOUT 50/50)
// ====================================================================

function SeatMapView() {
  const { viajeId } = useParams();
  const navigate = useNavigate();

  const [viaje, setViaje] = useState(null);
  const [asientosOcupados, setAsientosOcupados] = useState(new Set());
  const [asientosSeleccionados, setAsientosSeleccionados] = useState(new Set());
  const [pasajerosData, setPasajerosData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSelling, setIsSelling] = useState(false);
  const [activeFloor, setActiveFloor] = useState("piso2");

  const fetchTrip = useCallback(async () => {
    setLoading(true);
    try {
      // *** Usar su función de API real aquí: ***
      const data = await getTripDetails(viajeId);
      if (data) {
        setViaje(data);
        // Asegurarse de que los números de asiento en el Set son strings (coincidiendo con el layout)
        const ocupados = new Set(
          (data.asientos_ocupados || []).map((a) => String(a.numero_asiento))
        );
        setAsientosOcupados(ocupados);
      }
    } catch (error) {
      console.error("Error al cargar detalles del viaje:", error);
    } finally {
      setLoading(false);
    }
  }, [viajeId]);

  useEffect(() => {
    fetchTrip();
  }, [fetchTrip]);

  const toggleSeat = (number) => {
    if (asientosOcupados.has(number)) return;

    setAsientosSeleccionados((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
        setPasajerosData((p) => {
          const { [number]: _, ...rest } = p;
          return rest;
        });
      } else {
        newSet.add(number);
        setPasajerosData((p) => ({
          ...p,
          [number]: {
            nombre_pasajero: "",
            dni_pasajero: "",
            numero_asiento: number,
          },
        }));
      }
      return newSet;
    });
  };

  const handlePassengerChange = (seatNumber, field, value) => {
    setPasajerosData((prev) => ({
      ...prev,
      [seatNumber]: {
        ...prev[seatNumber],
        [field]: value,
        numero_asiento: seatNumber,
      },
    }));
  };

  const handleFinalizeSale = async () => {
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

    const asientosAPIVenta = Array.from(asientosSeleccionados).map(
      (seatNumber) => pasajerosData[seatNumber]
    );

    const saleData = {
      viaje_id: viaje.id,
      asientos: asientosAPIVenta,
    };

    // *** Usar su función de API real aquí: ***
    const result = await finalizeSale(saleData);
    setIsSelling(false);

    if (result.success) {
      alert(
        `✅ Venta #${
          result.data.id
        } realizada con éxito. Total: S/ ${result.data.total.toFixed(2)}`
      );
      // navigate("/ventas", { replace: true });
      // Forzar una recarga visual de asientos
      fetchTrip();
      setAsientosSeleccionados(new Set());
      setPasajerosData({});
    } else {
      const errorMsg =
        result.error.error || result.error.general || "Error desconocido.";
      alert(`❌ Error al procesar la venta: ${errorMsg}`);

      if (errorMsg.includes("Conflicto") || errorMsg.includes("asiento")) {
        // Si hay conflicto, recargar para mostrar asientos actualizados
        fetchTrip();
        setAsientosSeleccionados(new Set());
        setPasajerosData({});
      }
    }
  };

  // USANDO LA FUNCIÓN DE LAYOUT EXACTA
  const busLayout = useMemo(() => {
    // Asegurar que generateModasaZeusLayoutExact reciba un Set de strings
    if (!viaje) return { piso1: [], piso2: [] };
    return generateModasaZeusLayoutExact(asientosOcupados);
  }, [viaje, asientosOcupados]);

  const precioAsiento = useMemo(() => {
    if (!viaje?.precio_asiento) return 0;
    const precio = parseFloat(viaje.precio_asiento);
    return isNaN(precio) ? 0 : precio;
  }, [viaje?.precio_asiento]);

  const totalSeleccionado =
    Array.from(asientosSeleccionados).length * precioAsiento;

  const isFormIncomplete = Array.from(asientosSeleccionados).some(
    (seat) =>
      !pasajerosData[seat]?.nombre_pasajero ||
      pasajerosData[seat]?.dni_pasajero?.length < 8
  );

  if (loading && !viaje)
    return (
      <Container
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress size={60} />
      </Container>
    );

  if (!viaje)
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ p: 2 }}>
          <Typography variant="h6">Viaje no encontrado</Typography>
          <Typography>
            El viaje solicitado no existe o no está disponible.
          </Typography>
        </Alert>
      </Container>
    );

  return (
    
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#0D9488",
            borderLeft: "4px solid #34D399",
            pl: 2,
          }}
        >
          Venta de Pasajes
        </Typography>
        <Button
          onClick={() => navigate("/ventas")}
          variant="contained"
          color="primary"
          startIcon={<ArrowBack />}
          sx={{ borderRadius: 2 }}
        >
          Volver a Búsqueda
        </Button>
      </Box>

      {/*
            /******************************************************************
            * ESTRUCTURA PRINCIPAL: GRID 50/50 
            * En pantallas medianas (md) y grandes, la grilla se divide en 6/6 (50% / 50%).
            * En pantallas pequeñas (xs), ocupa el 12 (100%) y las secciones se apilan.
            ******************************************************************/}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          {/* COLUMNA IZQUIERDA - MAPA DE ASIENTOS (50%) */}

          <Grid size={8}>
            <Grid item xs={12} md={6}>
              <Card
                elevation={8}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  bgcolor: SEAT_COLORS.FONDO_BUS,
                }}
              >
                <CardContent
                  sx={{
                    p: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Pestañas de Pisos */}
                  <Tabs
                    value={activeFloor}
                    onChange={(e, newValue) => setActiveFloor(newValue)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ mb: 2 }}
                  >
                    <Tab label="🚌  SEGUNDO PISO (1-48)" value="piso2" />
                    <Tab label="🚌  PRIMER PISO (49-60)" value="piso1" />
                  </Tabs>

                  {/* Contenedor del Bus - Fondo claro y limpio */}
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      borderRadius: 3,
                      border: `1px solid ${SEAT_COLORS.BORDE_PISO}`,
                      backgroundColor: SEAT_COLORS.FONDO_PISO,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      overflow: "auto",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 380, // Ancho ajustado para el layout exacto de 7 columnas
                        p: 1,
                        position: "relative",
                      }}
                    >
                      {/* Indicador de Frente del Bus */}
                      <Box
                        sx={{
                          textAlign: "center",
                          mb: 2,
                          p: 1,
                          bgcolor: "#374151",
                          color: "white",
                          borderRadius: 1,
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                        }}
                      >
                        FRENTE
                      </Box>

                      {/* Renderizado del Layout EXACTO */}
                      {(activeFloor === "piso2"
                        ? <BusSeatLayout />
                        : <BusSeatLayout  option={true}/>
                      )}

                      {/* Indicador de Posterior del Bus */}
                      <Box
                        sx={{
                          textAlign: "center",
                          mt: 2,
                          p: 1,
                          bgcolor: "#D1D5DB",
                          color: "#374151",
                          borderRadius: 1,
                          fontWeight: "bold",
                          fontSize: "0.8rem",
                        }}
                      >
                        POSTERIOR
                      </Box>
                    </Box>
                  </Box>

                  {/* Leyenda Moderna */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: `1px solid ${SEAT_COLORS.BORDE_PISO}`,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                    >
                      LEYENDA:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: 1.5,
                      }}
                    >
                      <Chip
                        label="Disponible"
                        size="small"
                        sx={{
                          bgcolor: SEAT_COLORS.DISPONIBLE,
                          color: "#065F46",
                          fontWeight: 600,
                        }}
                        icon={<EventSeat />}
                      />
                      <Chip
                        label="Seleccionado"
                        size="small"
                        sx={{
                          bgcolor: SEAT_COLORS.SELECCIONADO,
                          color: "white",
                          fontWeight: 600,
                        }}
                        icon={<EventSeat />}
                      />
                      <Chip
                        label="Ocupado"
                        size="small"
                        sx={{
                          bgcolor: SEAT_COLORS.OCUPADO,
                          color: "#991B1B",
                          fontWeight: 600,
                        }}
                        icon={<EventSeat />}
                      />
                      <Chip
                        label="Reservado"
                        size="small"
                        variant="outlined"
                        sx={{ bgcolor: SEAT_COLORS.RESERVA }}
                        icon={<EventSeat />}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* COLUMNA DERECHA - INFORMACIÓN Y FORMULARIOS (50%) */}

          <Grid size={8}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Información del Viaje */}
                <Card
                  elevation={6}
                  sx={{ borderRadius: 3, borderLeft: "4px solid #0D9488" }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 700, color: "#111827" }}
                    >
                      📋 Detalles del Viaje
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, color: "#047857" }}
                        >
                          **{viaje.ruta?.ciudad_origen}** → **
                          {viaje.ruta?.ciudad_destino}**
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          🗓️ Fecha: **{viaje.fecha_salida}**
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          ⏰ Hora: **{viaje.hora_salida?.substring(0, 5)}**
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          🚌 Bus: **{viaje.bus?.placa}**
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          💺 Capacidad: **{viaje.bus?.capacidad_total}**
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, color: "primary.main" }}
                        >
                          💰 Precio por asiento: **S/ {precioAsiento.toFixed(2)}
                          **
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Resumen del Pedido */}
                <Card elevation={6} sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 700 }}
                    >
                      <Group sx={{ mr: 1, color: "#3B82F6" }} /> Resumen de
                      Selección
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography>Asientos:</Typography>
                        <Typography
                          fontWeight="600"
                          sx={{ fontSize: "0.9rem", color: "#065F46" }}
                        >
                          {Array.from(asientosSeleccionados)
                            .sort((a, b) => parseInt(a) - parseInt(b))
                            .join(", ") || "Ninguno"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography>Cantidad:</Typography>
                        <Typography fontWeight="600">
                          {asientosSeleccionados.size}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography>Subtotal:</Typography>
                        <Typography fontWeight="600">
                          S/{" "}
                          {(asientosSeleccionados.size * precioAsiento).toFixed(
                            2
                          )}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                          pt: 2,
                          borderTop: "2px solid #D1D5DB",
                        }}
                      >
                        <Typography variant="h6" fontWeight="700">
                          Total a Pagar:
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight="700"
                          color="#059669"
                        >
                          S/ {totalSeleccionado.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Formulario de Pasajeros y Botón de Venta */}
                {asientosSeleccionados.size > 0 && (
                  <Card elevation={6} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                      >
                        <CreditCard sx={{ mr: 1, color: "#F59E0B" }} /> Datos de
                        Pasajeros y Venta
                      </Typography>

                      {/* Alerta de Formulario Incompleto */}
                      {isFormIncomplete && (
                        <Alert
                          severity="warning"
                          icon={<Warning />}
                          sx={{ mb: 2, bgcolor: "#FEF3C7", color: "#92400E" }}
                        >
                          Complete los datos (nombre y DNI/Cédula, mínimo 8
                          dígitos) para finalizar la venta.
                        </Alert>
                      )}

                      {/* Formularios por Asiento */}
                      <Box
                        sx={{ maxHeight: 300, overflowY: "auto", pr: 1, mb: 2 }}
                      >
                        {Array.from(asientosSeleccionados)
                          .sort((a, b) => parseInt(a) - parseInt(b))
                          .map((seatNumber) => (
                            <Card
                              key={seatNumber}
                              variant="outlined"
                              sx={{
                                mb: 2,
                                borderLeft: `4px solid ${SEAT_COLORS.SELECCIONADO}`,
                                borderRadius: 2,
                              }}
                            >
                              <CardContent sx={{ p: 2 }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                  sx={{ mb: 2 }}
                                >
                                  👤 Asiento{" "}
                                  <Chip
                                    label={seatNumber}
                                    size="small"
                                    sx={{
                                      bgcolor: SEAT_COLORS.SELECCIONADO,
                                      color: "white",
                                      fontWeight: 700,
                                    }}
                                  />
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={7}>
                                    <TextField
                                      fullWidth
                                      required
                                      label="Nombre Completo"
                                      size="small"
                                      value={
                                        pasajerosData[seatNumber]
                                          ?.nombre_pasajero || ""
                                      }
                                      onChange={(e) =>
                                        handlePassengerChange(
                                          seatNumber,
                                          "nombre_pasajero",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={5}>
                                    <TextField
                                      fullWidth
                                      required
                                      label="DNI / Cédula (Mín. 8)"
                                      size="small"
                                      type="number"
                                      value={
                                        pasajerosData[seatNumber]
                                          ?.dni_pasajero || ""
                                      }
                                      onChange={(e) =>
                                        handlePassengerChange(
                                          seatNumber,
                                          "dni_pasajero",
                                          e.target.value
                                        )
                                      }
                                      error={
                                        pasajerosData[seatNumber]?.dni_pasajero
                                          ?.length > 0 &&
                                        pasajerosData[seatNumber]?.dni_pasajero
                                          ?.length < 8
                                      }
                                      helperText={
                                        pasajerosData[seatNumber]?.dni_pasajero
                                          ?.length > 0 &&
                                        pasajerosData[seatNumber]?.dni_pasajero
                                          ?.length < 8
                                          ? "Mínimo 8 dígitos"
                                          : ""
                                      }
                                    />
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          ))}
                      </Box>

                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        size="large"
                        onClick={handleFinalizeSale}
                        disabled={
                          isSelling ||
                          isFormIncomplete ||
                          asientosSeleccionados.size === 0
                        }
                        sx={{
                          mt: 1,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                        startIcon={
                          isSelling ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <CreditCard />
                          )
                        }
                      >
                        {isSelling
                          ? "PROCESANDO VENTA..."
                          : `FINALIZAR VENTA - S/ ${totalSeleccionado.toFixed(
                              2
                            )}`}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Manifiesto de Pasajeros Ocupados */}
                {viaje.asientos_ocupados?.length > 0 && (
                  <Card elevation={6} sx={{ borderRadius: 3 }}>
                    <CardContent sx={{ p: 0 }}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: "#DBEAFE",
                          color: "#1E40AF",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: 700 }}
                        >
                          📊 Pasajeros Confirmados (
                          {viaje.asientos_ocupados.length})
                        </Typography>
                      </Box>
                      <TableContainer
                        sx={{ maxHeight: 200, overflowY: "auto" }}
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ bgcolor: "#F9FAFB" }}>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Asiento
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Pasajero
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                DNI
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {viaje.asientos_ocupados
                              // Asegura que sort trabaje con números
                              .sort(
                                (a, b) =>
                                  parseInt(a.numero_asiento) -
                                  parseInt(b.numero_asiento)
                              )
                              .map((asiento) => (
                                <TableRow key={asiento.numero_asiento} hover>
                                  <TableCell>
                                    <Chip
                                      label={asiento.numero_asiento}
                                      size="small"
                                      sx={{
                                        bgcolor: SEAT_COLORS.OCUPADO,
                                        color: "white",
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {asiento.nombre_pasajero || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {asiento.dni_pasajero || "N/A"}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* <BusSeatingLayout initialTotalSeats={60} /> */}
      
    </Container>
  );
}

export default SeatMapView;
