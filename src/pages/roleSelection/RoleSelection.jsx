/* eslint-disable no-unused-vars */
import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    
    navigate('/login', { state: { role } });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #000000, #1a237e)',
        padding: 2,
        color: '#ffffff',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#212121',
          padding: 4,
          borderRadius: 4,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          color: '#ffffff',
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#536dfe' }}
        >
          Hoşgeldiniz
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleRoleSelection('admin')}
            sx={{
              padding: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              background: 'linear-gradient(to right, #3949ab, #536dfe)',
              color: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 3px 15px rgba(0, 0, 0, 0.5)',
              '&:hover': {
                background: 'linear-gradient(to right, #303f9f, #3d5afe)',
              },
            }}
          >
            Admin Girişi
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleRoleSelection('worker')}
            sx={{
              padding: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              background: 'linear-gradient(to right, #3949ab, #536dfe)',
              color: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 3px 15px rgba(0, 0, 0, 0.5)',
              '&:hover': {
                background: 'linear-gradient(to right, #303f9f, #3d5afe)',
              },
            }}
          >
            Çalışan  Girişi
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleRoleSelection('stokcu')}
            sx={{
              padding: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              background: 'linear-gradient(to right, #3949ab, #536dfe)',
              color: '#ffffff',
              borderRadius: 2,
              boxShadow: '0 3px 15px rgba(0, 0, 0, 0.5)',
              '&:hover': {
                background: 'linear-gradient(to right, #303f9f, #3d5afe)',
              },
            }}
          >
            Stokçu Girişi
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RoleSelection;
