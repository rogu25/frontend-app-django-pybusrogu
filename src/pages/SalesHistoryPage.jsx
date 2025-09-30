// frontend/src/pages/SalesHistoryPage.jsx

import React, { useState, useEffect } from "react";
import { getSalesHistory } from "../api/viajes";
import { Link } from "react-router-dom";

const SalesHistoryPage = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                // Llama a la nueva función de API que creamos
                const data = await getSalesHistory();
                setSales(data);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar ventas:", err);
                setError("No se pudo cargar el historial de ventas.");
                setLoading(false);
            }
        };

        fetchSales();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar

    if (loading) {
        return (
            <div className="container mt-5">
                <p>Cargando historial de ventas...</p>
            </div>
        );
    }

    if (error) {
        return <div className="container mt-5 alert alert-danger">{error}</div>;
    }

    if (sales.length === 0) {
        return (
            <div className="container mt-5">
                <h3>Historial de Ventas</h3>
                <p>Aún no has realizado ninguna venta.</p>
                <Link to="/ventas" className="btn btn-primary">
                    Ir a Ventas
                </Link>
            </div>
        );
    }

    // Función para formatear el total a dos decimales
    const formatTotal = (total) => {
        return parseFloat(total).toFixed(2);
    };

    return (
        <div className="container mt-5">
            <h3>Mi Historial de Ventas ({sales.length} registros)</h3>
            
            <Link to="/ventas" className="btn btn-sm btn-success mb-3">
                Crear Nueva Venta
            </Link>
            
            <table className="table table-striped table-hover mt-2">
                <thead className="table-dark">
                    <tr>
                        <th>ID Venta</th>
                        <th>Fecha y Hora</th>
                        <th>Ruta (Viaje)</th>
                        <th>Asientos Vendidos</th>
                        <th>Total (S/)</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((sale) => (
                        <tr key={sale.id}>
                            <td>{sale.id}</td>
                            <td>{new Date(sale.fecha_venta).toLocaleString()}</td>
                            <td>
                                {/* CORRECCIÓN: Uso de Encadenamiento Opcional (?. ) */}
                                <strong>{sale.viaje?.ruta?.ciudad_origen || "Ruta N/A"} →{" "}
                                {sale.viaje?.ruta?.ciudad_destino || "Ruta N/A"}</strong>
                                <small className="text-muted d-block">
                                    {sale.viaje?.fecha_salida || "Fecha N/A"} /{" "}
                                    {sale.viaje?.hora_salida || "Hora N/A"}
                                </small>
                            </td>
                            <td>{(sale.asientos_vendidos || []).length}</td>
                            <td>
                                <strong>S/ {formatTotal(sale.total)}</strong>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesHistoryPage;