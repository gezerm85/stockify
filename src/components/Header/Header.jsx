/* eslint-disable no-unused-vars */
import React from "react";
import { AppBar, Toolbar, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout/Logout";

const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: "#263238" }}>
      <Toolbar>
        <Grid container alignItems="center">
          {/* Sol tarafta Admin Panel butonu */}
          <Grid item xs={4}>
            <Typography
              variant="h6"
              sx={{ color: "#fff", cursor: "pointer" }}
              onClick={() => navigate("/admin")}
            >
              Admin Panel
            </Typography>
          </Grid>

          {/* Ortada Çalışan, Stok ve Kullanıcı ekle butonları */}
          <Grid
            item
            xs={4}
            sx={{ display: "flex", justifyContent: "center", gap: 3 }}
          >
            <Typography
              variant="body1"
              sx={{ cursor: "pointer", color: "#fff" }}
              onClick={() => navigate("/worker")}
            >
              Çalışan
            </Typography>
            <Typography
              variant="body1"
              sx={{ cursor: "pointer", color: "#fff" }}
              onClick={() => navigate("/stock")}
            >
              Stok
            </Typography>
            <Typography
              variant="body1"
              sx={{ cursor: "pointer", color: "#fff" }}
              onClick={() => navigate("/register")}
            >
              Kullanıcı ekle
            </Typography>
            <Typography
              variant="body1"
              sx={{ cursor: "pointer", color: "#fff" }}
              onClick={() => navigate("/logs")}
            >
              Kullanıcı Hareketleri
            </Typography>
          </Grid>

          {/* Logout butonunu en sağa almak için xs yerine "auto" kullan ve justifyContent: "flex-end" ekle */}
          <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Logout />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
