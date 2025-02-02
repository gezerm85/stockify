/* eslint-disable no-unused-vars */
// src/pages/unauthorized/Unauthorized.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firestore bağlantısını içe aktar

const Unauthorized = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(5); // Geri sayım 5 saniyeden başlıyor
  const [redirectPath, setRedirectPath] = useState("/login"); // Varsayılan olarak login sayfasına yönlendir

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // Kullanıcı giriş yapmışsa Firestore'dan rolünü al
      const fetchUserRole = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userRole = userDocSnap.data().role;

            // Kullanıcı rolüne göre yönlendirme yolunu ayarla
            switch (userRole) {
              case "admin":
                setRedirectPath("/admin");
                break;
              case "worker":
                setRedirectPath("/worker");
                break;
              case "stock":
                setRedirectPath("/stock");
                break;
              default:
                setRedirectPath("/unauthorized");
            }
          }
        } catch (error) {
          console.error("Kullanıcı rolü alınırken hata oluştu:", error);
        }
      };

      fetchUserRole();
    }

    // Geri sayım başlat
    const intervalId = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(intervalId);
          navigate(redirectPath); // Kullanıcıyı ilgili sayfaya yönlendir
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [navigate, redirectPath]);

  return (
    <Box
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-400 p-4"
    >
      <Paper
        elevation={10}
        className="p-8 rounded-lg text-center bg-white bg-opacity-90 shadow-xl"
        sx={{ maxWidth: "500px" }}
      >
        <ErrorOutlineIcon className="text-red-500 animate-bounce text-9xl mb-4" />
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Yetkisiz Erişim
        </Typography>
        <Typography variant="body1" className="text-gray-700 mb-4">
          Bu sayfaya erişim izniniz bulunmamaktadır.
        </Typography>
        <Typography variant="h5" className="text-gray-700 animate-pulse">
          {counter} saniye sonra yönlendirileceksiniz...
        </Typography>
      </Paper>
    </Box>
  );
};

export default Unauthorized;
