/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from '../pages/roleSelection/RoleSelection';
import Login from '../pages/login/login';
import Register from '../pages/register/register';
import AdminPage from '../pages/adminPage/adminPage';
import WorkerPage from '../pages/workerPage/workerPage';
import StockPage from '../pages/stockPage/stockPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="/worker" element={<WorkerPage />} />
        <Route path="/stock" element={<StockPage />} />
      </Routes>
    </Router>
  );
};
 
export default AppRouter;
