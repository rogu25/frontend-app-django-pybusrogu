import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { getDailySalesReport } from "../api/viajes";
import Header from "../components/Header"; // Lo usamos para tener la barra de navegación

const DailyReportPage = () => {
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReporte = async () => {
      try {
        const data = await getDailySalesReport();
        
        setReporte(data);
      } catch (err) {
        setError("No se pudo cargar el reporte diario. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchReporte();
  }, []);

  const formatTotal = (total) => {
    // Formatea el total a moneda, por ejemplo: S/ 1,234.50
    return `S/ ${parseFloat(total).toLocaleString("es-PE", {
      minimumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <>
        <Container
          component="main"
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
        >
          <CircularProgress />
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        
        <Container component="main" sx={{ mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reporte de Ventas Diarias
        </Typography>

        {reporte.length === 0 ? (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography>No hay registros de ventas para mostrar.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Fecha</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold" }}>
                    Total Vendido
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reporte.map((item) => (
                  <TableRow key={item.fecha} hover>
                    <TableCell>{item.fecha}</TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1" fontWeight="bold">
                        {formatTotal(item.total_ventas)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default DailyReportPage;
