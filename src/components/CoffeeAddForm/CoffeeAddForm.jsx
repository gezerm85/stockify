/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, Box, Typography, Paper } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const unitOptions = [
  { value: 'gr', label: 'gr' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
  { value: 'lt', label: 'lt' },
];

const CoffeeAddForm = () => {
  const [coffeeName, setCoffeeName] = useState('');
  const [coffeeAmount, setCoffeeAmount] = useState('');
  const [coffeeUnit, setCoffeeUnit] = useState('gr');
  const [syrupAmount, setSyrupAmount] = useState('');
  const [pumpCount, setPumpCount] = useState('');
  const [roomStockNumber, setRoomStockNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'coffees'), {
        coffeeName: coffeeName || '-',
        coffeeAmount: coffeeAmount || '-',
        coffeeUnit: coffeeUnit || '-',
        syrupAmount: syrupAmount || '-',
        pumpCount: pumpCount || '-',
        roomStockNumber: roomStockNumber || '-',
        createdAt: new Date(),
      });
      alert('Kahve başarıyla eklendi!');
      // Formu sıfırlama
      setCoffeeName('');
      setCoffeeAmount('');
      setCoffeeUnit('gr');
      setSyrupAmount('');
      setPumpCount('');
      setRoomStockNumber('');
    } catch (error) {
      console.error('Veri eklenirken hata oluştu: ', error);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        maxWidth: 600,
        margin: 'auto',
        mt: 6,
        borderRadius: 3,
        background: '#f4f6f9',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#333' }}
      >
        Yeni Kahve Ekle
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kahve İsmi"
              value={coffeeName}
              onChange={(e) => setCoffeeName(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Kahve Miktarı"
              type="number"
              value={coffeeAmount}
              onChange={(e) => setCoffeeAmount(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              select
              fullWidth
              label="Birim"
              value={coffeeUnit}
              onChange={(e) => setCoffeeUnit(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            >
              {unitOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Şurup Miktarı (ml)"
              type="number"
              value={syrupAmount}
              onChange={(e) => setSyrupAmount(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Pompa Sayısı"
              type="number"
              value={pumpCount}
              onChange={(e) => setPumpCount(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Oda Stok No"
              value={roomStockNumber}
              onChange={(e) => setRoomStockNumber(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              Kaydet
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CoffeeAddForm;
