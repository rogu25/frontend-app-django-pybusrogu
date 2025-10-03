import React from 'react';
import { Box, Typography } from '@mui/material';
import Seat from './Seat';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const ICON_STYLE = { fontSize: '20px', color: 'grey.600', width: '25px', flexShrink: 0 };
const AISLE_ICON_STYLE = { fontSize: '18px', color: 'grey.600' };
const SEAT_WIDTH = 50;
const AISLE_WIDTH = 40;
const ICON_MARGIN = 5;

// Componente para el Pasillo Central (4 iconos)
const AisleSeparator = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', mx: 1, width: `${AISLE_WIDTH}px`, flexShrink: 0, height: '60px' }}>
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
    </Box>
);

// Componente para el espacio (Gradas, Baño, etc.)
const SpaceFiller = ({ label, icon: Icon, width }) => (
  <Box
    sx={{
      width: width,
      height: '30px',
      m: '2px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'grey.200',
      borderRadius: '4px',
      p: 0.5,
      flexShrink: 0,
    }}
  >
    {Icon && <Icon sx={{ fontSize: '16px', mr: 0.5 }} />}
    <Typography variant="caption" sx={{ lineHeight: 1, fontWeight: 'bold', color: 'grey.800' }}>
      {label}
    </Typography>
  </Box>
);

/**
 * Distribución del Segundo Piso (Asientos 13 - 60).
 * Sigue la estructura compleja del MODELO ASIENTOS 1, usando anchos fijos para justificación homogénea.
 */
const SecondFloorLayout = ({ totalSeats, seatsStatus, handleSeatClick, firstFloorSeatsCount = 12 }) => {
  let currentSeatNumber = firstFloorSeatsCount + 1; // Asiento inicial (13)
  
  // Ancho total del área de asientos + pasillo. Usado para el espacio de gradas.
  // (Ventana + 2 Asientos + Pasillo + 2 Asientos + Ventana)
  const FULL_ROW_WIDTH = 
    (2 * 25) + // 2 Ventanas/Iconos laterales
    (4 * SEAT_WIDTH) + // 4 Asientos
    (2 * AISLE_WIDTH) + // Pasillo Central (4 Iconos)
    (6 * 2); // 6 x 2px de gap (ajuste visual)

  // Configuración de las filas
  const rowsConfig = [
    // Fila 1 (13-16) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 2 (17-20) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 3 (21-24) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 4 (25-26) - Espacio Gradas: Icono | 25 | 26 | Icono | Icono | ESPACIO GRADAS
    { type: 'irregular', seatsLeft: 2, seatsRight: 0, space: 'GRADA' },
    // Fila 5 (27-28) - Pasillo | ESPACIO GRADAS
    { type: 'irregular', seatsLeft: 2, seatsRight: 0, space: 'GRADA_PASILLO' }, 
    // Fila 6 (29-32) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 7 (33-36) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 8 (37-40) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 9 (41-44) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 10 (45-48) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 11 (49-52) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 12 (53-56) - Pasillo Central
    { type: 'regular', seats: 4 },
    // Fila 13 (57-60) - Pasillo Central
    { type: 'regular', seats: 4 },
  ];

  const renderLayout = () => {
    return rowsConfig.map((row, index) => {
        let content;
        const rowKey = `row-${index}`;
        const isRegular = row.type === 'regular';

        if (isRegular) {
            const startL = currentSeatNumber;
            const startR = startL + 2;

            content = (
                <>
                    {/* Ventana Izquierda */}
                    <WindowOutlinedIcon sx={ICON_STYLE} />

                    {/* Asientos Izquierda (Pareja) */}
                    <Seat
                        seatNumber={startL}
                        status={seatsStatus[startL] || 'AVAILABLE'}
                        onSeatClick={handleSeatClick}
                        isSelectable={startL <= totalSeats}
                    />
                    <Seat
                        seatNumber={startL + 1}
                        status={seatsStatus[startL + 1] || 'AVAILABLE'}
                        onSeatClick={handleSeatClick}
                        isSelectable={startL + 1 <= totalSeats}
                    />

                    {/* Pasillo (4 Iconos) */}
                    <AisleSeparator />

                    {/* Asientos Derecha (Pareja) */}
                    <Seat
                        seatNumber={startR}
                        status={seatsStatus[startR] || 'AVAILABLE'}
                        onSeatClick={handleSeatClick}
                        isSelectable={startR <= totalSeats}
                    />
                    <Seat
                        seatNumber={startR + 1}
                        status={seatsStatus[startR + 1] || 'AVAILABLE'}
                        onSeatClick={handleSeatClick}
                        isSelectable={startR + 1 <= totalSeats}
                    />

                    {/* Ventana Derecha */}
                    <WindowOutlinedIcon sx={ICON_STYLE} />
                </>
            );
            currentSeatNumber += 4;
        } else if (row.type === 'irregular') {
            // Irregularidad por Gradas (Filas 4 y 5 del modelo)
            const startL = currentSeatNumber;
            const isGradaPasillo = row.space === 'GRADA_PASILLO';
            
            // Los asientos 25-28 (modelo) se encuentran en estas dos filas irregulares
            
            content = (
                <>
                    {/* Ventana Izquierda */}
                    <WindowOutlinedIcon sx={ICON_STYLE} />

                    {/* Asientos Izquierda (Pareja) */}
                    <Seat
                        seatNumber={startL}
                        status={seatsStatus[startL] || 'AVAILABLE'}
                        onSeatClick={handleSeatClick}
                        isSelectable={startL <= totalSeats}
                    />
                    <Seat
                        seatNumber={startL + 1}
                        status={seatsStatus[startL + 1] || 'AVAILABLE'}
                        onSeatClick={handleSeatClick}
                        isSelectable={startL + 1 <= totalSeats}
                    />
                    
                    {/* Separador e Iconos/Pasillo */}
                    {isGradaPasillo ? (
                        <AisleSeparator /> // Pasillo con 4 íconos
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', mx: 1, width: `${AISLE_WIDTH}px`, flexShrink: 0, justifyContent: 'center' }}>
                             {/* Iconos del separador central (2 iconos según el modelo) */}
                             <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
                             <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
                        </Box>
                    )}

                    {/* Espacio (Gradas) - Ocupa el espacio de la pareja derecha y la ventana */}
                    <SpaceFiller label="Gradas/Escalera" icon={MeetingRoomIcon} width={`calc(2 * ${SEAT_WIDTH}px + 2 * ${ICON_STYLE.width} + 2 * 2px)`} />
                    
                    {/* Ventana Derecha (Oculta por el espacio) */}
                    {/* <WindowOutlinedIcon sx={ICON_STYLE} /> */}
                </>
            );
            currentSeatNumber += 2; // Solo 2 asientos en estas filas
        }


        return (
            <Box 
                key={rowKey} 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mb: 1.5,
                    gap: '2px', // Espacio entre elementos
                }}
            >
                {content}
            </Box>
        );
    });
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        p: 2,
        m: 1,
        borderRadius: '8px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" align="center" gutterBottom>
        Segundo Piso (Asientos {firstFloorSeatsCount + 1} - {totalSeats})
      </Typography>
      <Box sx={{ width: '100%', maxWidth: '800px' }}>
        <Typography variant="subtitle2" align="center" sx={{ mb: 1, fontWeight: 'bold' }}>
          Parte Delantera del Bus 🚌
        </Typography>
        {renderLayout()}
        <Typography variant="subtitle2" align="center" sx={{ mt: 1, fontWeight: 'bold' }}>
          Parte Trasera del Bus 🚽
        </Typography>
      </Box>
    </Box>
  );
};

export default SecondFloorLayout;