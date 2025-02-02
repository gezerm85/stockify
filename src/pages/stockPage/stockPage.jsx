/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper } from "@mui/material";
import AddProduct from "../../components/Stock/AddProduct";
import InventoryCheck from "../../components/Stock/InventoryCheck";

export default function StockPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", backgroundColor: "#f4f6f9", padding: 4 }}>
      <Typography variant="h4" textAlign="center" fontWeight={600} mb={3} color="#37474f">
        Depo Yönetimi
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3, padding: 3, backgroundColor: "#ffffff" }}>
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Ürün Ekle" />
          <Tab label="Sayım Yap" />
        </Tabs>

        {/* İçerik değişimi */}
        {activeTab === 0 && <AddProduct />}
        {activeTab === 1 && <InventoryCheck />}
      </Paper>
    </Box>
  );
}
