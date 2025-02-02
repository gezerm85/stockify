/* eslint-disable no-unused-vars */
// src/components/Logout/Logout.jsx
import React from 'react';
import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const Logout = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth); // Firebase Auth'dan çıkış yapar.
      // Çıkış yapıldıktan sonra kullanıcıyı login sayfasına yönlendir.
      navigate('/');
    } catch (error) {
      console.error("Firebase Auth'dan çıkış yapılamadı:", error);
    }
  };

  return (
    <Button
      variant="contained"
      color="error"
      startIcon={<LogoutIcon />}
      onClick={handleLogout}
    >
      Çıkış Yap
    </Button>
  );
};

export default Logout;
