/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, MenuItem, Alert } from '@mui/material';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Kullanıcı adı boş olamaz.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "E-posta adresi boş olamaz.";
    } else if (!/^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz.";
    }

    if (!formData.password) {
      newErrors.password = "Parola boş olamaz.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Parola en az 6 karakter olmalıdır.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Parolalar eşleşmiyor.";
    }

    if (!formData.role) {
      newErrors.role = "Rol seçmelisiniz.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (!validate()) return;

    const auth = getAuth();
    const db = getFirestore();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: formData.username,
      });

      await setDoc(doc(db, "users", user.uid), {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        userUuid: user.uid,
      });

      setSuccessMessage("Kayıt başarılı! Giriş yapabilirsiniz.");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setErrorMessage("Kayıt sırasında bir hata oluştu: " + error.message);
    }
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
          Kayıt Ol
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
            label="Kullanıcı Adı"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.username}
            helperText={errors.username}
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
            label="E-posta"
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            margin="normal"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
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
            error={!!errors.password}
            helperText={errors.password}
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
            label="Parola Onay"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            margin="normal"
            variant="outlined"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            sx={{
              backgroundColor: '#1c1c1c',
              borderRadius: 2,
              color: '#ffffff',
              input: { color: '#ffffff' },
              label: { color: '#aaaaaa' },
            }}
          />
          <TextField
            select
            fullWidth
            label="Rol Seçin"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            error={!!errors.role}
            helperText={errors.role}
            sx={{
              backgroundColor: '#1c1c1c',
              borderRadius: 2,
              color: '#ffffff',
              input: { color: '#ffffff' },
              label: { color: '#aaaaaa' },
              '& .MuiSelect-icon': { color: '#ffffff' },
            }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="worker">Worker</MenuItem>
            <MenuItem value="stokcu">Stokçu</MenuItem>
          </TextField>
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
            Kayıt Ol
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
