/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

const unitOptions = [
  { value: "gr", label: "Gram" },
  { value: "kg", label: "Kilogram" },
  { value: "ml", label: "Mililitre" },
  { value: "lt", label: "Litre" },
  { value: "pump", label: "Pompa" },
];

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editRecipe, setEditRecipe] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [stockData, setStockData] = useState([]);

  // Reçeteleri çekiyoruz
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const fetched = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetched);
        setFilteredRecipes(fetched);
      } catch (error) {
        console.error("Reçeteler çekilirken hata:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Stok verilerini çekiyoruz (urunler koleksiyonu)
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "urunler"));
        const stocks = querySnapshot.docs.map((doc) => ({
          stockCode: doc.id,
          ...doc.data(),
        }));
        setStockData(stocks);
      } catch (error) {
        console.error("Stok verileri çekilirken hata:", error);
      }
    };
    fetchStockData();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredRecipes(recipes);
      return;
    }
    const filtered = recipes.filter((r) =>
      r.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  const openEditDialog = (recipe) => {
    setEditRecipe(recipe);
    setOpenDialog(true);
  };

  const closeEditDialog = () => {
    setOpenDialog(false);
    setEditRecipe(null);
  };

  const handleUpdate = async () => {
    if (!editRecipe) return;
    try {
      const recipeRef = doc(db, "recipes", editRecipe.id);
      await updateDoc(recipeRef, { ...editRecipe });
      const updated = recipes.map((r) =>
        r.id === editRecipe.id ? editRecipe : r
      );
      setRecipes(updated);
      setFilteredRecipes(updated);
      closeEditDialog();
      alert("Reçete güncellendi!");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Reçete güncellenirken hata oluştu.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "recipes", id));
      const updated = recipes.filter((r) => r.id !== id);
      setRecipes(updated);
      setFilteredRecipes(updated);
      alert("Reçete silindi!");
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Reçete silinirken hata oluştu.");
    }
  };

  // Düzenleme alanındaki değişiklikleri güncellemek için
  const handleEditChange = (field, value) => {
    setEditRecipe({ ...editRecipe, [field]: value });
  };

  // Ana malzeme düzenlemesi
  const handleEditMainIngredientChange = (field, value) => {
    setEditRecipe({
      ...editRecipe,
      mainIngredient: { ...editRecipe.mainIngredient, [field]: value },
    });
  };

  // Ekstra malzemelerdeki değişiklikler
  const handleEditExtraChange = (index, field, value) => {
    const newExtras = editRecipe.extras ? [...editRecipe.extras] : [];
    newExtras[index] = { ...newExtras[index], [field]: value };
    setEditRecipe({ ...editRecipe, extras: newExtras });
  };

  const handleAddExtraToEdit = () => {
    const newExtra = { stockCode: "", productName: "", amount: "", unit: "gr" };
    const newExtras = editRecipe.extras ? [...editRecipe.extras, newExtra] : [newExtra];
    setEditRecipe({ ...editRecipe, extras: newExtras });
  };

  const handleRemoveExtraFromEdit = (index) => {
    const newExtras = editRecipe.extras ? [...editRecipe.extras] : [];
    newExtras.splice(index, 1);
    setEditRecipe({ ...editRecipe, extras: newExtras });
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f6f9", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={600} color="#37474f">
          Reçete Listesi
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Ara"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            ARA
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#263238" }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                Reçete İsmi
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                Ana Malzeme
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                Ekstra Malzemeler
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                Oluşturulma Tarihi
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "#ffffff" }}>
                İşlemler
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id} sx={{ "&:hover": { backgroundColor: "#eceff1" } }}>
                  <TableCell align="center">{recipe.recipeName}</TableCell>
                  <TableCell align="center">
                    {recipe.mainIngredient
                      ? `${recipe.mainIngredient.productName} (${recipe.mainIngredient.amount} ${recipe.mainIngredient.unit})`
                      : "Yok"}
                  </TableCell>
                  <TableCell align="center">
                    {recipe.extras && recipe.extras.length > 0 ? (
                      recipe.extras.map((ex, i) => (
                        <Box key={i}>
                          {ex.productName} ({ex.amount} {ex.unit})
                        </Box>
                      ))
                    ) : (
                      "Yok"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {recipe.createdAt && recipe.createdAt.toDate
                      ? recipe.createdAt.toDate().toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => openEditDialog(recipe)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(recipe.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ fontWeight: "bold", color: "#ff0000" }}
                >
                  Reçete bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={closeEditDialog} maxWidth="md" fullWidth>
        <DialogTitle>Reçete Düzenle</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }} component="form" noValidate autoComplete="off">
            <TextField
              fullWidth
              label="Reçete İsmi"
              variant="outlined"
              margin="normal"
              value={editRecipe?.recipeName || ""}
              onChange={(e) => handleEditChange("recipeName", e.target.value)}
            />

            {/* Ana Malzeme */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Ana Malzeme
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Malzeme Seçiniz</InputLabel>
                  <Select
                    label="Malzeme Seçiniz"
                    value={editRecipe?.mainIngredient?.stockCode || ""}
                    onChange={(e) => {
                      const selectedCode = e.target.value;
                      const selectedStock = stockData.find(
                        (item) => item.stockCode === selectedCode
                      );
                      handleEditMainIngredientChange("stockCode", selectedCode);
                      handleEditMainIngredientChange(
                        "productName",
                        selectedStock ? selectedStock.productName : ""
                      );
                    }}
                  >
                    <MenuItem value="">
                      <em>Seçiniz</em>
                    </MenuItem>
                    {stockData.map((item) => (
                      <MenuItem key={item.stockCode} value={item.stockCode}>
                        {item.productName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={4}>
                <TextField
                  fullWidth
                  label="Miktar"
                  variant="outlined"
                  margin="normal"
                  type="number"
                  value={editRecipe?.mainIngredient?.amount || ""}
                  onChange={(e) =>
                    handleEditMainIngredientChange("amount", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} md={4}>
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Birim</InputLabel>
                  <Select
                    label="Birim"
                    value={editRecipe?.mainIngredient?.unit || ""}
                    onChange={(e) =>
                      handleEditMainIngredientChange("unit", e.target.value)
                    }
                  >
                    {unitOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Ekstra Malzemeler */}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              Ekstra Malzemeler
            </Typography>
            {editRecipe?.extras && editRecipe.extras.length > 0 ? (
              editRecipe.extras.map((ex, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Malzeme Seçiniz</InputLabel>
                      <Select
                        label="Malzeme Seçiniz"
                        value={ex.stockCode}
                        onChange={(e) =>
                          handleEditExtraChange(index, "stockCode", e.target.value)
                        }
                      >
                        <MenuItem value="">
                          <em>Seçiniz</em>
                        </MenuItem>
                        {stockData.map((item) => (
                          <MenuItem key={item.stockCode} value={item.stockCode}>
                            {item.productName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField
                      fullWidth
                      label="Miktar"
                      variant="outlined"
                      margin="normal"
                      type="number"
                      value={ex.amount}
                      onChange={(e) =>
                        handleEditExtraChange(index, "amount", e.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <FormControl fullWidth variant="outlined" margin="normal">
                      <InputLabel>Birim</InputLabel>
                      <Select
                        label="Birim"
                        value={ex.unit}
                        onChange={(e) =>
                          handleEditExtraChange(index, "unit", e.target.value)
                        }
                      >
                        {unitOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveExtraFromEdit(index)}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                Ekstra malzeme yok.
              </Typography>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={handleAddExtraToEdit}
              >
                Ekstra Malzeme Ekle
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog} color="secondary">
            İptal
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecipeList;
