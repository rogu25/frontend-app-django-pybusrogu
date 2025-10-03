import React, { useMemo, useState } from "react";
import { Box, Grid, Typography, Paper, Stack, styled } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat"; // asiento
import WcIcon from "@mui/icons-material/Wc"; // baño
import StairsIcon from "@mui/icons-material/Stairs"; // gragas
import icon_volante from "../assets/icons/volante-24.png";
import WindowIcon from "@mui/icons-material/Window";
// import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LiveTvIcon from "@mui/icons-material/LiveTv";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  marginLeft: "20px",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const DEFAULT_SEAT_COLORS = {
  available: "#E8F5E9", // light green
  occupied: "#BDBDBD", // gray
  reserved: "#FFE0B2", // orange-ish
  selected: "#90CAF9", // light blue
  border: "#B0BEC5",
};

const SeatBox = ({
  seatNumber,
  state,
  onClick,
  width = 50,
  height = 30,
  icon: Icon,
}) => {
  const bg = DEFAULT_SEAT_COLORS[state] || DEFAULT_SEAT_COLORS.available;
  return (
    <Paper
      elevation={1}
      onClick={onClick}
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
        px: 0.5,
        cursor: "pointer",
        userSelect: "none",
        backgroundColor: bg,
        border: `1px solid ${DEFAULT_SEAT_COLORS.border}`,
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {Icon ? (
          <Icon sx={{ fontSize: 16 }} />
        ) : (
          <EventSeatIcon sx={{ fontSize: 16 }} />
        )}
        <Typography variant="caption" sx={{ fontSize: 11 }}>
          {seatNumber}
        </Typography>
      </Box>
    </Paper>
  );
};

// Componente Primer Piso
const FirstFloor = ({ count = 12, seatSize, seatStates, setSeatStates }) => {
  // Layout simple: filas con parejas y pasillo central
  const rows = Math.ceil(count / 4); // cada fila hasta 4 asientos (2 a la izquierda y 2 a la derecha)
  let seatIdx = 1; // numeración local del primer piso

  const rowsArr = Array.from({ length: rows }).map((_, r) => {
    const leftA = seatIdx <= count ? seatIdx++ : null;
    const leftB = seatIdx <= count ? seatIdx++ : null;
    const rightA = seatIdx <= count ? seatIdx++ : null;
    const rightB = seatIdx <= count ? seatIdx++ : null;
    return { left: [leftA, leftB], right: [rightA, rightB] };
  });

  return (
    <Box sx={{ mb: 2 }}>
      <Stack spacing={1}>
        {/* Add a front area with bus icon */}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={6}>
            <Item>
              <img src={icon_volante} alt="Descripción de la imagen" />
            </Item>
          </Grid>
          <Grid size={6}></Grid>
          <Grid size={6}>
            <Item>
              <Grid>
                <WcIcon />
              </Grid>
              <Grid>
                <Typography variant="caption">Servicios</Typography>
              </Grid>
            </Item>
          </Grid>
          <Grid size={6}>
            <Item>
              <Grid>
                <StairsIcon />
              </Grid>
              <Grid>
                <Typography variant="caption">Puerta</Typography>
              </Grid>
            </Item>
          </Grid>
        </Grid>

        {rowsArr.map((r, ridx) => (
          <Grid container alignItems="center" key={ridx} wrap="nowrap">
            <Grid item sx={{ display: "flex", alignItems: "center", px: 0.5 }}>
              <WindowIcon />
            </Grid>

            {/* left pair */}
            <Grid item sx={{ display: "flex", gap: 0.5 }}>
              {r.left.map((s, i) =>
                s ? (
                  <Grid>
                    <LiveTvIcon />
                    <SeatBox
                      key={`f1-${s}`}
                      seatNumber={s + 48}
                      state={seatStates[s - 1]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeatClickFloor(e, "first", s - 1, setSeatStates);
                      }}
                      icon={EventSeatIcon}
                      width={seatSize.width}
                      height={seatSize.height}
                    />
                  </Grid>
                ) : (
                  <Box key={`emptyL-${i}`} sx={{ width: seatSize.width }} />
                )
              )}
            </Grid>

            {/* center icons (bathroom + stairs icons shown for first floor) */}
            <Grid
              item
              sx={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Grid></Grid>
              </Box>
            </Grid>

            {/* right pair */}
            <Grid item sx={{ display: "flex", gap: 0.5 }}>
              {r.right.map((s, i) =>
                s ? (
                  <Grid>
                    <LiveTvIcon />
                    <SeatBox
                      key={`f1-${s}`}
                      seatNumber={s + 48}
                      state={seatStates[s - 1]}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeatClickFloor(e, "first", s - 1, setSeatStates);
                      }}
                      icon={EventSeatIcon}
                      width={seatSize.width}
                      height={seatSize.height}
                    />
                  </Grid>
                ) : (
                  <Box key={`emptyR-${i}`} sx={{ width: seatSize.width }} />
                )
              )}
            </Grid>

            <Grid item sx={{ display: "flex", alignItems: "center", px: 0.5 }}>
              <WindowIcon />
            </Grid>
          </Grid>
        ))}
      </Stack>
    </Box>
  );
};

// Componente Segundo Piso (layout irregular según ejemplo, numeración independiente que empieza en 1)
const SecondFloor = ({ count = 48, seatSize, seatStates, setSeatStates }) => {
  // We'll map rows to the pattern provided in the prompt.
  // Cada fila usará numeración local (1..count) y las zonas de "gradas" no contendrán asientos.

  let nextSeat = 1;
  const consume = () => (nextSeat <= count ? nextSeat++ : null);
  const space_logo = () => {
    return <StairsIcon />;
  };

  // Build rows according to a pattern inspired by tu ejemplo (12 filas principales)
  // Para las filas que contienen 'stairs' en midIcons, NO colocamos asientos en la columna donde están las gradas.
  const patternRows = [
    {
      left: [consume(), consume()],
      midIcons: [1],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [consume(), consume()],
    },
    // fila con espacio gradas (no asientos en la columna central derecha)
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [null, null],
      space_logo: space_logo(),
    },
    {
      left: [consume(), consume()],
      midIcons: [1],
      right: [null, null],
    },
    {
      left: [consume(), consume()],
      midIcons: [],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [1],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [1],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [consume(), consume()],
    },
    {
      left: [consume(), consume()],
      midIcons: [0],
      right: [consume(), consume()],
    },
  ];

  // Tail rows (ej. area baño + gradas en el ejemplo con filas cortas)
  const tailRows = [];
  // We'll create compact rows while seats remain (each with a few seats and a pasillo)
  while (nextSeat <= count) {
    // left pair and one right seat (to emulate the example rows 49..60)
    tailRows.push({
      left: [consume(), consume()],
      midIcons: ["wc", "pasillo"],
      right: [consume()],
    });
  }

  const allRows = [...patternRows, ...tailRows];

  return (
    <Box>
      <Stack spacing={1}>
        {/* front area: driver icon + espacio baño + gradas */}
        <Grid container spacing={2} columns={16}>
          <Grid size={6} alignItems={"flex-end"}>
            <Item>
              <img src={icon_volante} alt="Descripción de la imagen" />
            </Item>
          </Grid>
          <Grid size={6}></Grid>
        </Grid>

        {allRows.map((row, ridx) => (
          <Grid container alignItems="center" key={ridx} wrap="nowrap">
            <Grid item sx={{ display: "flex", alignItems: "center", px: 0.5 }}>
              <WindowIcon />
            </Grid>

            {/* left pair */}
            <Grid item sx={{ display: "flex", gap: 0.5 }}>
              {row.left.map((s, i) =>
                s ? (
                  <SeatBox
                    key={`s2-${s}`}
                    seatNumber={s}
                    state={seatStates[s - 1]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeatClickFloor(e, "second", s - 1, setSeatStates);
                    }}
                    width={seatSize.width}
                    height={seatSize.height}
                    icon={EventSeatIcon}
                  />
                ) : (
                  <Box key={`l-empty-${i}`} sx={{ width: seatSize.width }} />
                )
              )}
            </Grid>

            {/* mid icons or stairs/wc/aisle */}
            <Grid
              item
              sx={{ flex: 1, display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {row.midIcons &&
                  row.midIcons.map((mi, idx) => {
                    if (mi === "stairs")
                      return (
                        <Grid container>
                          <Grid size={12}>
                            <Item>
                              <StairsIcon key={idx} />
                            </Item>
                          </Grid>
                        </Grid>
                      );
                    // if (mi === "stairs") return <StairsIcon key={idx} />;
                    if (mi === "pasillo")
                      return <Box key={idx} sx={{ width: 24 }} />; // visual aisle spacer
                    if (mi === 1) return <LiveTvIcon key={idx} />;
                    return <Box key={idx} sx={{ width: 24 }} />;
                  })}
              </Box>
            </Grid>

            {/* right pair */}
            <Grid item sx={{ display: "flex", gap: 0.5 }}>
              {row.right.map((s, i) =>
                s ? (
                  <SeatBox
                    key={`s2-${s}`}
                    seatNumber={s}
                    state={seatStates[s - 1]}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSeatClickFloor(e, "second", s - 1, setSeatStates);
                    }}
                    width={seatSize.width}
                    height={seatSize.height}
                    icon={EventSeatIcon}
                  />
                ) : (
                  // if null, render an empty space (this is the "gradas" area)
                  <Box
                    key={`r-empty-${i}`}
                    sx={{
                      width: seatSize.width,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                    }}
                  ></Box>
                )
              )}
            </Grid>

            {/* right icon */}
            <Grid item sx={{ display: "flex", alignItems: "center", px: 0.5 }}>
              {ridx > 2 && ridx < 4 ? (
                <Grid>
                  <StairsIcon fontSize="large" color="error" />
                </Grid>
              ) : (
                <WindowIcon />
              )}
            </Grid>
          </Grid>
        ))}
      </Stack>
    </Box>
  );
};

// Manejo de clicks por piso (numeración e indices locales)
function handleSeatClickFloor(e, floor, indexZeroBased, setSeatStates) {
  // e.altKey -> occupied, e.shiftKey -> reserved, normal -> toggle selected
  if (e.altKey) {
    setSeatStates((prev) => {
      const copy = [...prev];
      copy[indexZeroBased] = "occupied";
      return copy;
    });
    return;
  }
  if (e.shiftKey) {
    setSeatStates((prev) => {
      const copy = [...prev];
      copy[indexZeroBased] = "reserved";
      return copy;
    });
    return;
  }

  setSeatStates((prev) => {
    const copy = [...prev];
    const cur = copy[indexZeroBased];
    if (cur === "selected") copy[indexZeroBased] = "available";
    else copy[indexZeroBased] = "selected";
    return copy;
  });
}

const BusSeatSelector = ({
  option = false,
  totalSeats = 60,
  seatWidth = 50,
  seatHeight = 30,
  piso_1 = 12,
}) => {
  // default split: primer piso 12 asientos (si totalSeats < 12 se ajusta), segundo piso el resto
  const secondFloorCount = totalSeats - piso_1;
  const firstFloorCount = piso_1;

  const seatSize = useMemo(
    () => ({ width: seatWidth, height: seatHeight }),
    [seatWidth, seatHeight]
  );

  // Estados por piso (numeración local en cada piso: 1..N)
  const [firstFloorStates, setFirstFloorStates] = useState(() =>
    Array.from({ length: firstFloorCount }).map(() => "available")
  );
  const [secondFloorStates, setSecondFloorStates] = useState(() =>
    Array.from({ length: secondFloorCount }).map(() => "available")
  );

  // Si cambian las props totalSeats, re-inicializamos los arrays (simplemente re-create)
  // Nota: en un caso real quizás querríamos preservar estados al cambiar solo tamaño, pero aquí reiniciamos para simplicidad.
  React.useEffect(() => {
    setFirstFloorStates(
      Array.from({ length: firstFloorCount }).map(() => "available")
    );
    setSecondFloorStates(
      Array.from({ length: secondFloorCount }).map(() => "available")
    );
  }, [firstFloorCount, secondFloorCount]);

  // const resetAll = () => {
  //   setFirstFloorStates(
  //     Array.from({ length: firstFloorCount }).map(() => "available")
  //   );
  //   setSecondFloorStates(
  //     Array.from({ length: secondFloorCount }).map(() => "available")
  //   );
  // };

  // const Legend = ({ color, label }) => (
  //   <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
  //     <Box
  //       sx={{
  //         width: 18,
  //         height: 12,
  //         backgroundColor: color,
  //         border: `1px solid ${DEFAULT_SEAT_COLORS.border}`,
  //       }}
  //     />
  //     <Typography variant="caption">{label}</Typography>
  //   </Box>
  // );

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Grid container spacing={2}>
        {option ? (
          <Grid item xs={12} md={6}>
            <FirstFloor
              count={firstFloorCount}
              seatSize={seatSize}
              seatStates={firstFloorStates}
              setSeatStates={setFirstFloorStates}
            />
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            <SecondFloor
              count={secondFloorCount}
              seatSize={seatSize}
              seatStates={secondFloorStates}
              setSeatStates={setSecondFloorStates}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BusSeatSelector;
