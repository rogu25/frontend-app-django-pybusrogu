import React from 'react';
import { Box, Typography } from '@mui/material';
import Seat from './Seat';
import WindowOutlinedIcon from '@mui/icons-material/WindowOutlined';
import AirlineStopsIcon from '@mui/icons-material/AirlineStops';

const ICON_STYLE = { fontSize: '20px', color: 'grey.600', width: '25px', flexShrink: 0 };
const AISLE_ICON_STYLE = { fontSize: '18px', color: 'grey.600' };

// Componente para el Pasillo Central (4 iconos)
const AisleSeparator = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', mx: 1, width: '40px', flexShrink: 0, height: '60px' }}>
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
        <AirlineStopsIcon sx={AISLE_ICON_STYLE} />
    </Box>
);

/**
 * Primer Piso: 12 asientos. 4 filas de (Ventana | 1 | 2 | Pasillo | 3 | 4 | Ventana)
 * La disposición es homogénea y centrada.
 */
const FirstFloorLayout = ({ totalSeats, seatsStatus, handleSeatClick }) => {
  const firstFloorSeatsCount = 12;

  const renderRow = (startSeat) => {
    const seat1 = startSeat;
    const seat2 = startSeat + 1;
    const seat3 = startSeat + 2;
    const seat4 = startSeat + 3;

    return (
      <Box
        key={`row-${startSeat}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Centrado homogéneo
          mb: 1.5,
          gap: '2px', // Espacio entre elementos
        }}
      >
        {/* Ventana Izquierda */}
        <WindowOutlinedIcon sx={ICON_STYLE} />

        {/* Asientos Izquierda (1 y 2) */}
        <Seat
          seatNumber={seat1}
          status={seatsStatus[seat1] || 'AVAILABLE'}
          onSeatClick={handleSeatClick}
          isSelectable={seat1 <= totalSeats}
        />
        <Seat
          seatNumber={seat2}
          status={seatsStatus[seat2] || 'AVAILABLE'}
          onSeatClick={handleSeatClick}
          isSelectable={seat2 <= totalSeats}
        />

        {/* Pasillo (4 Iconos) */}
        <AisleSeparator />

        {/* Asientos Derecha (3 y 4) */}
        <Seat
          seatNumber={seat3}
          status={seatsStatus[seat3] || 'AVAILABLE'}
          onSeatClick={handleSeatClick}
          isSelectable={seat3 <= totalSeats}
        />
        <Seat
          seatNumber={seat4}
          status={seatsStatus[seat4] || 'AVAILABLE'}
          onSeatClick={handleSeatClick}
          isSelectable={seat4 <= totalSeats}
        />

        {/* Ventana Derecha */}
        <WindowOutlinedIcon sx={ICON_STYLE} />
      </Box>
    );
  };

  const rows = [];
  for (let i = 1; i <= firstFloorSeatsCount; i += 4) {
    rows.push(renderRow(i));
  }

  return (
    <Box sx={{ border: '1px solid #ccc', p: 2, m: 1, borderRadius: '8px', width: '100%', maxWidth: '600px', mx: 'auto' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Primer Piso (Asientos 1 - 12)
      </Typography>
      {rows}
    </Box>
  );
};

export default FirstFloorLayout;