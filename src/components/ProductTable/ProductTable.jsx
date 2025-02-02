import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const unitOptions = [
  { value: "gr", label: "gr" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "lt", label: "lt" },
];

export default function ProductTable() {
  const [coffees, setCoffees] = useState([]);
  const [editCoffee, setEditCoffee] = useState(null);
  const [open, setOpen] = useState(false);

  // Firestore'dan kahve verilerini çek
  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "coffees"));
        const fetchedCoffees = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoffees(fetchedCoffees);
      } catch (error) {
        console.error("Kahveleri çekerken hata:", error);
      }
    };

    fetchCoffees();
  }, []);

  // Ürünü güncelle
  const handleUpdate = async () => {
    if (!editCoffee) return;

    try {
      const coffeeRef = doc(db, "coffees", editCoffee.id);
      await updateDoc(coffeeRef, { ...editCoffee });

      setCoffees((prev) =>
        prev.map((c) => (c.id === editCoffee.id ? editCoffee : c))
      );

      setOpen(false);
      setEditCoffee(null);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  // Ürünü sil
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "coffees", id));
      setCoffees((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f4f6f9", borderRadius: 3 }}>
      <Typography variant="h4" fontWeight={600} textAlign="center" mb={3} color="#37474f">
        Kahve Listesi
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#263238" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>Stok No</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>Kahve İsmi</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>Miktar</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>Ölçü Birimi</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>Pompa</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>Şurup</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#ffffff", textAlign: "center" }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coffees.length > 0 ? (
              coffees.map((coffee) => (
                <TableRow key={coffee.id} sx={{ "&:hover": { backgroundColor: "#eceff1" } }}>
                  <TableCell align="center">{coffee.roomStockNumber}</TableCell>
                  <TableCell align="center">{coffee.coffeeName}</TableCell>
                  <TableCell align="center">{coffee.coffeeAmount}</TableCell>
                  <TableCell align="center">{coffee.coffeeUnit}</TableCell>
                  <TableCell align="center">{coffee.pumpCount}</TableCell>
                  <TableCell align="center">{coffee.syrupAmount}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => { setEditCoffee(coffee); setOpen(true); }}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(coffee.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ fontWeight: "bold", color: "#ff0000" }}>
                  Kahve bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Düzenleme Modalı */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Kahveyi Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Kahve İsmi"
            variant="outlined"
            margin="dense"
            value={editCoffee?.coffeeName || ""}
            onChange={(e) => setEditCoffee({ ...editCoffee, coffeeName: e.target.value })}
          />
          <TextField
            fullWidth
            label="Miktar"
            variant="outlined"
            margin="dense"
            value={editCoffee?.coffeeAmount || ""}
            onChange={(e) => setEditCoffee({ ...editCoffee, coffeeAmount: e.target.value })}
          />
          {/* Ölçü birimi için Select menü */}
          <Select
            fullWidth
            variant="outlined"
            margin="dense"
            value={editCoffee?.coffeeUnit || ""}
            onChange={(e) => setEditCoffee({ ...editCoffee, coffeeUnit: e.target.value })}
          >
            {unitOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Pompa Sayısı"
            variant="outlined"
            margin="dense"
            value={editCoffee?.pumpCount || ""}
            onChange={(e) => setEditCoffee({ ...editCoffee, pumpCount: e.target.value })}
          />
          <TextField
            fullWidth
            label="Şurup Miktarı"
            variant="outlined"
            margin="dense"
            value={editCoffee?.syrupAmount || ""}
            onChange={(e) => setEditCoffee({ ...editCoffee, syrupAmount: e.target.value })}
          />
          <TextField
            fullWidth
            label="Stok Numarası"
            variant="outlined"
            margin="dense"
            value={editCoffee?.roomStockNumber || ""}
            onChange={(e) => setEditCoffee({ ...editCoffee, roomStockNumber: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">İptal</Button>
          <Button onClick={handleUpdate} color="primary">Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
