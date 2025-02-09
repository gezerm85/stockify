import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const unitOptions = [
  { value: "gr", label: "gr" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "lt", label: "lt" },
];

export default function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editStock, setEditStock] = useState(null);
  const [open, setOpen] = useState(false);

  // Firestore'dan stok verilerini çek
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stock"));
        const fetchedStocks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStocks(fetchedStocks);
        setFilteredStocks(fetchedStocks); // İlk etapta tüm veriler gösterilir
      } catch (error) {
        console.error("Stokları çekerken hata:", error);
      }
    };

    fetchStocks();
  }, []);

  // Arama işlemi
  const handleSearch = () => {
    const filtered = stocks.filter((stock) =>
      stock.stockNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  // Stok güncelleme
  const handleUpdate = async () => {
    if (!editStock) return;

    try {
      const stockRef = doc(db, "stock", editStock.id);
      await updateDoc(stockRef, { ...editStock });

      setStocks((prev) =>
        prev.map((s) => (s.id === editStock.id ? editStock : s))
      );

      setFilteredStocks((prev) =>
        prev.map((s) => (s.id === editStock.id ? editStock : s))
      );

      setOpen(false);
      setEditStock(null);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  // Stok silme
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "stock", id));
      setStocks((prev) => prev.filter((s) => s.id !== id));
      setFilteredStocks((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f4f6f9", borderRadius: 3 }}>
        <div className="flex items-center justify-between">
        <Typography
          variant="h4"
          fontWeight={600}
          textAlign="center"
          mb={3}
          color="#37474f"
        >
          Kahve Listesi
        </Typography>
            <div className="flex justify-between gap-4">
            <TextField
     
            label="Ara"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
                    <Button
   
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Ara
          </Button>
            </div>
        </div>

      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#263238" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Stok Numarası
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Ürün Adı
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Miktar
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Birim
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Son Güncelleyen
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                İşlemler
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <TableRow
                  key={stock.id}
                  sx={{ "&:hover": { backgroundColor: "#eceff1" } }}
                >
                  <TableCell align="center">{stock.stockNumber}</TableCell>
                  <TableCell align="center">{stock.productName}</TableCell>
                  <TableCell align="center">{stock.quantity}</TableCell>
                  <TableCell align="center">{stock.unit}</TableCell>
                  <TableCell align="center">{stock.lastUpdatedBy}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setEditStock(stock);
                        setOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(stock.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ fontWeight: "bold", color: "#ff0000" }}
                >
                  Stok bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Düzenleme Modalı */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Stok Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Ürün Adı"
            variant="outlined"
            margin="dense"
            value={editStock?.productName || ""}
            onChange={(e) =>
              setEditStock({ ...editStock, productName: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Miktar"
            variant="outlined"
            margin="dense"
            value={editStock?.quantity || ""}
            onChange={(e) =>
              setEditStock({ ...editStock, quantity: e.target.value })
            }
          />
          <Select
            fullWidth
            variant="outlined"
            margin="dense"
            value={editStock?.unit || ""}
            onChange={(e) =>
              setEditStock({ ...editStock, unit: e.target.value })
            }
          >
            {unitOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Stok Numarası"
            variant="outlined"
            margin="dense"
            value={editStock?.stockNumber || ""}
            onChange={(e) =>
              setEditStock({ ...editStock, stockNumber: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            İptal
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
