import React from 'react';
import { Box, Typography } from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';

// Colores de estado
const STATE_COLORS = {
  AVAILABLE: 'primary.main', // Azul
  OCCUPIED: 'error.main',   // Rojo
  RESERVED: 'warning.main',  // Ámbar
  SELECTED: 'success.main',  // Verde
};

/**
 * Componente individual del asiento.
 * Gestiona el estado visual y la lógica de selección al hacer clic.
 */
const Seat = ({ seatNumber, status, onSeatClick, isSelectable }) => {
  const isSelected = status === 'SELECTED';
  const isOccupied = status === 'OCCUPIED';
  const isReserved = status === 'RESERVED';
  const isAvailable = status === 'AVAILABLE';

  // Determinar el color de fondo basado en el estado
  let bgColor = STATE_COLORS.AVAILABLE;
  if (isSelected) {
    bgColor = STATE_COLORS.SELECTED;
  } else if (isOccupied) {
    bgColor = STATE_COLORS.OCCUPIED;
  } else if (isReserved) {
    bgColor = STATE_COLORS.RESERVED;
  }

  // Deshabilitar la acción de clic si está ocupado o reservado
  const canClick = isAvailable || isSelected;

  const handleClick = () => {
    if (isSelectable && canClick) {
      onSeatClick(seatNumber);
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        width: '50px',
        height: '30px',
        backgroundColor: bgColor,
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isSelectable && canClick ? 'pointer' : 'default',
        opacity: isSelectable && canClick ? 1 : 0.8,
        transition: 'background-color 0.2s',
        boxShadow: 1,
        border: isSelected ? '2px solid black' : 'none', // Borde negro para selección
        m: '2px', // Pequeño margen para separación visual
        '&:hover': {
            backgroundColor: isSelectable && canClick ? (isSelected ? STATE_COLORS.SELECTED : 'primary.light') : bgColor,
        },
      }}
    >
      <EventSeatIcon sx={{ fontSize: '18px', color: 'white' }} />
      <Typography variant="caption" sx={{ lineHeight: 1, color: 'white', fontWeight: 'bold' }}>
        {seatNumber}
      </Typography>
    </Box>
  );
};

export default Seat;