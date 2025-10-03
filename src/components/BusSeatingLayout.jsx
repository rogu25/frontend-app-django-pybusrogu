import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Divider,
  TextField,
} from "@mui/material";
import FirstFloorLayout from "./FirstFloorLayout";
import SecondFloorLayout from "./SecondFloorLayout";

const DEFAULT_TOTAL_SEATS = 60;
const FIRST_FLOOR_SEATS = 12;

/**
 * Componente principal que gestiona el layout completo del bus.
 * Permite cambiar el número total de asientos dinámicamente.
 *
 * NOTA: Inicialmente, todos los asientos están en estado 'AVAILABLE'.
 */
const BusSeatingLayout = ({ initialTotalSeats = DEFAULT_TOTAL_SEATS }) => {
  const [totalSeats, setTotalSeats] = useState(initialTotalSeats);
  const [inputSeats, setInputSeats] = useState(String(initialTotalSeats));
  const [selectedSeats, setSelectedSeats] = useState({}); // Estado para la selección del usuario

  // Estado inicial de todos los asientos (simulando Ocupados/Reservados)
  const initialSeatStatus = {};
  for (let i = 1; i <= totalSeats; i++) {
    // Ejemplo de estados iniciales: Asientos 5 y 13 ocupados, 60 reservado
    if (i === 5 || i === 13) {
      initialSeatStatus[i] = "OCCUPIED";
    } else if (i === 60) {
      initialSeatStatus[i] = "RESERVED";
    } else {
      initialSeatStatus[i] = "AVAILABLE";
    }
  }

  const [seatsStatus, setSeatsStatus] = useState(initialSeatStatus);

  // Manejador del clic para la lógica de selección de asientos
  const handleSeatClick = useCallback(
    (seatNumber) => {
      setSeatsStatus((prevStatus) => {
        const currentStatus = prevStatus[seatNumber];

        // La lógica solo aplica a asientos no ocupados ni reservados (o si ya están seleccionados)
        if (currentStatus === "OCCUPIED" || currentStatus === "RESERVED") {
          return prevStatus; // No permitir la selección/des-selección
        }

        const newStatus = { ...prevStatus };

        if (currentStatus === "SELECTED" || currentStatus === "AVAILABLE") {
          // Alternar entre SELECCIONADO y DISPONIBLE
          newStatus[seatNumber] =
            currentStatus === "SELECTED" ? "AVAILABLE" : "SELECTED";
        }

        return newStatus;
      });

      // Actualizar la lista de asientos seleccionados
      setSelectedSeats((prevSelected) => {
        const isSelected = prevSelected[seatNumber];
        const newSelected = { ...prevSelected };

        if (isSelected) {
          delete newSelected[seatNumber];
        } else if (
          seatsStatus[seatNumber] === "AVAILABLE" ||
          seatsStatus[seatNumber] === undefined
        ) {
          // Solo permitir seleccionar si está disponible
          newSelected[seatNumber] = true;
        }
        return newSelected;
      });
    },
    [seatsStatus]
  );

  // Manejador del cambio dinámico del número de asientos
  const handleSeatCountChange = () => {
    const newTotal = parseInt(inputSeats, 10);
    if (newTotal > FIRST_FLOOR_SEATS && newTotal <= 100) {
      // Límite arbitrario de 100
      setTotalSeats(newTotal);

      // Reiniciar el estado de los asientos para el nuevo total
      const newSeatsStatus = {};
      for (let i = 1; i <= newTotal; i++) {
        newSeatsStatus[i] = initialSeatStatus[i] || "AVAILABLE"; // Mantener el estado si ya existía
      }
      setSeatsStatus(newSeatsStatus);
      setSelectedSeats({});
    } else {
      alert(
        `El número total debe ser mayor que ${FIRST_FLOOR_SEATS} (Mínimo: Primer Piso) y un número válido.`
      );
    }
  };

  const seatsSelectedCount = Object.keys(seatsStatus).filter(
    (key) => seatsStatus[key] === "SELECTED"
  ).length;

  return (
    <Container
      maxWidth="lg"
      sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: "8px" }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        🚌 Disposición de Asientos de Bus Interprovincial 🚌
      </Typography>

      {/* Control Dinámico de Asientos */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: "4px",
          bgcolor: "white",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          label="Total Asientos"
          type="number"
          value={inputSeats}
          onChange={(e) => setInputSeats(e.target.value)}
          size="small"
          sx={{ width: "150px" }}
        />
        <Button variant="contained" onClick={handleSeatCountChange}>
          Aplicar Cambio
        </Button>
      </Box>

      {/* Leyenda de Estados */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 3 }}>
        {["AVAILABLE", "SELECTED", "OCCUPIED", "RESERVED"].map((status) => (
          <Box key={status} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 20,
                height: 20,
                mr: 1,
                borderRadius: "4px",
                backgroundColor:
                  status === "AVAILABLE"
                    ? "primary.main"
                    : status === "SELECTED"
                    ? "success.main"
                    : status === "OCCUPIED"
                    ? "error.main"
                    : "warning.main", // RESERVED
              }}
            />
            <Typography variant="body2">
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        variant="h6"
        align="center"
        color="success.dark"
        sx={{ mb: 2 }}
      >
        Asientos seleccionados: **{seatsSelectedCount}**
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Primer Piso */}
      <Box sx={{ mb: 4, width: "100%" }}>
        <FirstFloorLayout
          totalSeats={totalSeats}
          seatsStatus={seatsStatus}
          handleSeatClick={handleSeatClick}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Segundo Piso */}
      <Box sx={{ width: "100%" }}>
        <SecondFloorLayout
          totalSeats={totalSeats}
          seatsStatus={seatsStatus}
          handleSeatClick={handleSeatClick}
          firstFloorSeatsCount={FIRST_FLOOR_SEATS}
        />
      </Box>
    </Container>
  );
};

export default BusSeatingLayout;
