/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Box, Typography, Paper, Alert, FormControlLabel, Checkbox } from '@mui/material';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = location.state?.role; // Role bilgisi state üzerinden alınır

  useEffect(() => {
    // Eğer role bilgisi gelmemişse ana sayfaya yönlendir
    if (!role) {
      navigate('/');
    }
  }, [role, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const auth = getAuth();

    try {
      // Firebase Authentication ile giriş yap
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // "Beni Hatırla" özelliği
      if (formData.rememberMe) {
        localStorage.setItem('userEmail', formData.email);
      } else {
        localStorage.removeItem('userEmail');
      }

      // Role göre yönlendirme
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'worker') {
        navigate('/worker');
      } else if (role === 'stokcu') {
        navigate('/stock');
      } else {
        setErrorMessage('Geçersiz rol. Erişim reddedildi.');
      }

      setSuccessMessage(`Giriş başarılı! Rol: ${role}, Hoş geldiniz, ${user.email}`);
    } catch (error) {
      console.error('Giriş hatası:', error);
      setErrorMessage(`Giriş sırasında bir hata oluştu: ${error.message}`);
    }
  };

  const handleRegister = () => {
    navigate('/register'); // Register sayfasına yönlendir
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
          {role ? `${role} Girişi` : 'Giriş'}
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-posta"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: '#1c1c1c',
              borderRadius: 2,
              color: '#ffffff',
              input: { color: '#ffffff' },
              label: { color: '#aaaaaa' },
            }}
          />
          <TextField
            fullWidth
            label="Parola"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            margin="normal"
            variant="outlined"
            sx={{
              backgroundColor: '#1c1c1c',
              borderRadius: 2,
              color: '#ffffff',
              input: { color: '#ffffff' },
              label: { color: '#aaaaaa' },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                sx={{ color: '#536dfe' }}
              />
            }
            label={<Typography sx={{ color: '#ffffff' }}>Beni Hatırla</Typography>}
            sx={{ marginTop: 1 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
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
            Giriş Yap
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={handleRegister}
            sx={{
              marginTop: 2,
              padding: 1.5,
              fontSize: '1rem',
              textTransform: 'none',
              color: '#536dfe',
              borderColor: '#536dfe',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#303f9f',
                color: '#ffffff',
              },
            }}
          >
            Kayıt Ol
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
