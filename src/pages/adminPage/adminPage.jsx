/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import RecipeList from '../../components/RecipeList/RecipeList';
import StockTable from '../../components/Stock/StockTable';
import ExcelReader from '../../components/ExcelReader/ExcelReader';
import RecipeAddForm from '../../components/RecipeAddForm/RecipeAddForm';


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
          <Tab label="Reçete Ekle" />
          <Tab label="Reçete Listesi" />
          <Tab label="Stok Listesi" />
        </Tabs>

        {/* Sekmeye Göre İçerik */}
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && <RecipeAddForm />}
          {activeTab === 1 && <RecipeList/>}
          {activeTab === 2 && <StockTable/>}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPage;
