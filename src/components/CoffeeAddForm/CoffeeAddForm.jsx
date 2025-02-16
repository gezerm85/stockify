import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const unitOptions = [
  { value: "gr", label: "gram" },
  { value: "kg", label: "kilogram" },
  { value: "ml", label: "mililitre" },
  { value: "lt", label: "litre" },
  { value: "pump", label: "pompa" },
];

const CoffeeAddForm = () => {
  const [stockData, setStockData] = useState([]);
  const [coffeeName, setCoffeeName] = useState("");
  const [mainIngredient, setMainIngredient] = useState({
    stockCode: "",
    name: "",
    amount: "",
    unit: "gr",
  });
  const [extras, setExtras] = useState([]);

  // Firestore'dan `stock` verilerini çekme
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stock"));
        const stocks = querySnapshot.docs.map((doc) => ({
          stockCode: doc.id, // Firestore'daki belge ID'si
          ...doc.data(), // Belge içeriği
        }));
        setStockData(stocks);
      } catch (error) {
        console.error("Stok verileri yüklenirken hata oluştu: ", error);
      }
    };

    fetchStockData();
  }, []);

  // Ekstra malzeme ekleme
  const handleAddExtra = () => {
    setExtras([
      ...extras,
      { id: Date.now(), stockCode: "", name: "", amount: "", unit: "gr" },
    ]);
  };

  // Ekstra malzeme kaldırma
  const handleRemoveExtra = (id) => {
    setExtras(extras.filter((extra) => extra.id !== id));
  };

  // Ekstra malzeme düzenleme
  const handleExtraChange = (id, field, value) => {
    setExtras(
      extras.map((extra) =>
        extra.id === id ? { ...extra, [field]: value } : extra
      )
    );
  };

  // Formu gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const coffeeData = {
        coffeeName: coffeeName,
        mainIngredient,
        // eslint-disable-next-line no-unused-vars
        extras: extras.map(({ id, ...extra }) => extra), // ID hariç tüm alanlar
        createdAt: new Date(),
      };

      // Belirli bir `coffeeName` için Firestore'da veri ekleme
      await setDoc(doc(db, "coffees", coffeeName), coffeeData);
      alert("Kahve başarıyla eklendi!");

      // Formu sıfırlama
      setCoffeeName("");
      setMainIngredient({ stockCode: "", name: "", amount: "", unit: "gr" });
      setExtras([]);
    } catch (error) {
      console.error("Veri eklenirken hata oluştu: ", error);
    }
  };

  // Eğer `stockData` henüz yüklenmediyse yükleniyor mesajı göster
  if (stockData.length === 0) {
    return <Typography align="center">Stok verileri yükleniyor...</Typography>;
  }

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        maxWidth: 800,
        margin: "auto",
        mt: 6,
        borderRadius: 3,
        background: "#f4f6f9",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Yeni Kahve Ekle
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Kahve İsmi */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kahve İsmi"
              value={coffeeName}
              onChange={(e) => setCoffeeName(e.target.value)}
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>

          {/* Ana Malzeme Seçimi */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Kahve Çekirdeği"
              value={mainIngredient.stockCode}
              onChange={(e) =>
                setMainIngredient({
                  ...mainIngredient,
                  stockCode: e.target.value,
                  name: stockData.find(
                    (item) => item.stockCode === e.target.value
                  )?.Name,
                })
              }
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            >
              {stockData.map((item) => (
                <MenuItem key={item.stockCode} value={item.stockCode}>
                  {item.Name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              fullWidth
              label="Miktar"
              type="number"
              value={mainIngredient.amount}
              onChange={(e) =>
                setMainIngredient({ ...mainIngredient, amount: e.target.value })
              }
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              select
              fullWidth
              label="Birim"
              value={mainIngredient.unit}
              onChange={(e) =>
                setMainIngredient({ ...mainIngredient, unit: e.target.value })
              }
              variant="outlined"
              sx={{ backgroundColor: "white", borderRadius: 1 }}
            >
              {unitOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Ekstra Malzemeler */}
          {extras.map((extra) => (
            <React.Fragment key={extra.id}>
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  label="Ekstra Malzeme"
                  value={extra.stockCode}
                  onChange={(e) =>
                    handleExtraChange(extra.id, "stockCode", e.target.value)
                  }
                  variant="outlined"
                  sx={{ backgroundColor: "white", borderRadius: 1 }}
                >
                  {stockData.map((item) => (
                    <MenuItem key={item.stockCode} value={item.stockCode}>
                      {item.Name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Miktar"
                  type="number"
                  value={extra.amount}
                  onChange={(e) =>
                    handleExtraChange(extra.id, "amount", e.target.value)
                  }
                  variant="outlined"
                  sx={{ backgroundColor: "white", borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  select
                  fullWidth
                  label="Birim"
                  value={extra.unit}
                  onChange={(e) =>
                    handleExtraChange(extra.id, "unit", e.target.value)
                  }
                  variant="outlined"
                  sx={{ backgroundColor: "white", borderRadius: 1 }}
                >
                  {unitOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={2} sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveExtra(extra.id)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Grid>
            </React.Fragment>
          ))}

          {/* Ekstra Ekle Butonu */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleAddExtra}
              startIcon={<AddCircleOutlineIcon />}
            >
              Ekstra Malzeme Ekle
            </Button>
          </Grid>

          {/* Kaydet Butonu */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontSize: "1.1rem" }}
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