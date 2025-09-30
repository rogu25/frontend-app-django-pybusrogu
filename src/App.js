// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import SalesView from './pages/SalesView'; 
import SeatMapView from './pages/SeatMapView';
import SalesHistoryPage from './pages/SalesHistoryPage';

// Función para verificar si el usuario está autenticado
// Se usa para las rutas protegidas.
const isAuthenticated = () => {
    return !!localStorage.getItem('authToken');
};

// Componente de Ruta Protegida: Redirige a / si no hay token.
const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        // Podríamos también limpiar cualquier token inválido aquí, aunque el login ya lo hace.
        return <Navigate to="/" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* 1. Ruta de Inicio de Sesión (Ruta pública) */}
                <Route path="/" element={<LoginPage />} />
                
                {/* 2. Rutas Protegidas (Requieren autenticación) */}
                
                <Route path="/ventas" element={
                    <ProtectedRoute>
                        <SalesView />
                    </ProtectedRoute>
                } />
                
                <Route path="/ventas/asientos/:viajeId" element={ // Vista de Mapa de Asientos
                    <ProtectedRoute>
                        <SeatMapView />
                    </ProtectedRoute>
                } />

                {/* 🎯 CORRECCIÓN: La ruta /historial DEBE ser protegida */}
                <Route path="/historial" element={
                    <ProtectedRoute>
                        <SalesHistoryPage />
                    </ProtectedRoute>
                } />
                
                {/* 3. Ruta "Catch-all" (Redirige a / en caso de ruta desconocida) */}
                {/* Nota: Debe ir al final para que las rutas anteriores se evalúen primero. */}
                <Route path="*" element={<Navigate to="/ventas" replace />} />
            </Routes>
        </Router>
    );
}

export default App;