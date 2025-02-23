/* eslint-disable no-unused-vars */
// src/Router/AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login/Login';
import Register from '../pages/Register/Register';
import AdminPage from '../pages/AdminPage/AdminPage';
import WorkerPage from '../pages/WorkerPage/WorkerPage';
import StockPage from '../pages/StockPage/StockPage';
import Unauthorized from '../pages/Unauthorized/Unauthorized'; 
import ProtectedRoute from './ProtectedRoute';
import LogsPage from '../pages/LogsPage/LogsPage';
import InventoryChecksList from '../pages/InventoryChecksList/InventoryChecksList';

const AppRouter = () => {
  return (
    <Routes>
      {/* Hem / hem de /login sayfası Login bileşenini gösterecek */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/worker"
        element={
          <ProtectedRoute allowedRoles={['worker', 'admin']}>
            <WorkerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/register"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Register />
          </ProtectedRoute>
        }
      />

      <Route
        path="/stock"
        element={
          <ProtectedRoute allowedRoles={['stock', 'admin']}>
            <StockPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <LogsPage />
          </ProtectedRoute>
        }
      />
            <Route
        path="/census"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <InventoryChecksList/>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRouter;
