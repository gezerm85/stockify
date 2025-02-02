/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Alert, FormControlLabel, Checkbox } from "@mui/material";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firestore bağlantısını içe aktar

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const auth = getAuth();

    // Kullanıcı giriş yapmışsa yönlendirme yap
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userRole = userDocSnap.data().role;

            // Kullanıcıyı rolüne göre yönlendir
            switch (userRole) {
              case "admin":
                navigate("/admin", { replace: true });
                break;
              case "worker":
                navigate("/worker", { replace: true });
                break;
              case "stock":
                navigate("/stock", { replace: true });
                break;
              default:
                navigate("/unauthorized", { replace: true });
            }
          }
        } catch (error) {
          console.error("Kullanıcı rolü alınırken hata oluştu:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "E-posta adresi gereklidir.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Geçerli bir e-posta adresi giriniz.";
    }

    if (!formData.password) {
      errors.password = "Parola gereklidir.";
    } else if (formData.password.length < 6) {
      errors.password = "Parola en az 6 karakter olmalıdır.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) {
      return;
    }

    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Kullanıcının rolünü Firestore'dan çek
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userRole = userDocSnap.data().role;

        // Kullanıcı rolüne göre yönlendirme yap
        switch (userRole) {
          case "admin":
            navigate("/admin", { replace: true });
            break;
          case "worker":
            navigate("/worker", { replace: true });
            break;
          case "stock":
            navigate("/stock", { replace: true });
            break;
          default:
            navigate("/unauthorized", { replace: true });
        }
      } else {
        setErrorMessage("Kullanıcı rolü bulunamadı.");
      }
    } catch (error) {
      setErrorMessage("Giriş başarısız: " + error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #000000, #1a237e)",
        padding: 2,
        color: "#ffffff",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#212121",
          padding: 4,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          color: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#536dfe" }}
        >
          Giriş Yapın
        </Typography>
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
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{
              backgroundColor: "#1c1c1c",
              borderRadius: 2,
              color: "#ffffff",
              input: { color: "#ffffff" },
              label: { color: "#aaaaaa" },
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
            error={!!formErrors.password}
            helperText={formErrors.password}
            sx={{
              backgroundColor: "#1c1c1c",
              borderRadius: 2,
              color: "#ffffff",
              input: { color: "#ffffff" },
              label: { color: "#aaaaaa" },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                sx={{ color: "#536dfe" }}
              />
            }
            label={<Typography sx={{ color: "#ffffff" }}>Beni Hatırla</Typography>}
            sx={{ marginTop: 1 }}
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              marginTop: 2,
              padding: 1.5,
              fontSize: "1rem",
              textTransform: "none",
              background: "linear-gradient(to right, #3949ab, #536dfe)",
              color: "#ffffff",
              borderRadius: 2,
              boxShadow: "0 3px 15px rgba(0, 0, 0, 0.5)",
              "&:hover": {
                background: "linear-gradient(to right, #303f9f, #3d5afe)",
              },
            }}
          >
            Giriş Yap
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
