/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import CoffeeAddForm from '../../components/CoffeeAddForm/CoffeeAddForm';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ProductTable from '../../components/ProductTable/ProductTable';
import StockTable from '../../components/Stock/StockTable';


const AdminPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh' }}>

      <Box sx={{ p: 2 }}>
        {/* Üst Tab Menüsü */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Kahve Ekle" />
          <Tab label="Kahve Listesi" />
          <Tab label="Stok Listesi" />
        </Tabs>

        {/* Sekmeye Göre İçerik */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <CoffeeAddForm />}
          {activeTab === 1 && <ProductTable/>}
          {activeTab === 2 && <StockTable/>}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
