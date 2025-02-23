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
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editStock, setEditStock] = useState(null);
  const [open, setOpen] = useState(false);

  // Firestore'dan "urunler" koleksiyonundaki verileri çekiyoruz
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "urunler"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStocks(fetchedProducts);
        setFilteredStocks(fetchedProducts);
      } catch (error) {
        console.error("Verileri çekerken hata:", error);
      }
    };

    fetchProducts();
  }, []);

  // Arama işlemi: productCode üzerinden arama
  const handleSearch = () => {
    const filtered = stocks.filter((stock) =>
      stock.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStocks(filtered);
  };

  // Ürün güncelleme
  const handleUpdate = async () => {
    if (!editStock) return;
    try {
      const productRef = doc(db, "urunler", editStock.id);
      await updateDoc(productRef, { ...editStock });
      setStocks((prev) => prev.map((s) => (s.id === editStock.id ? editStock : s)));
      setFilteredStocks((prev) =>
        prev.map((s) => (s.id === editStock.id ? editStock : s))
      );
      setOpen(false);
      setEditStock(null);
    } catch (error) {
      console.error("Güncelleme hatası:", error);
    }
  };

  // Ürün silme
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "urunler", id));
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
          Product List
        </Typography>
        <div className="flex justify-between gap-4">
          <TextField
            label="Search"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
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
                Ürün Kodu
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Ürün ismi
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
               Ürün Miktarı
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
                Actions
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
                  <TableCell align="center">{stock.productCode}</TableCell>
                  <TableCell align="center">{stock.productName}</TableCell>
                  <TableCell align="center">{stock.productQuantity}</TableCell>
                  <TableCell align="center">{stock.unit}</TableCell>
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
                  colSpan={4}
                  align="center"
                  sx={{ fontWeight: "bold", color: "#ff0000" }}
                >
                  No Products Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Düzenleme Modalı */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Code"
            variant="outlined"
            margin="dense"
            value={editStock?.productCode || ""}
            onChange={(e) =>
              setEditStock({ ...editStock, productCode: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            margin="dense"
            value={editStock?.productName || ""}
            onChange={(e) =>
              setEditStock({ ...editStock, productName: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Product Quantity"
            variant="outlined"
            margin="dense"
            value={editStock?.productQuantity || ""}
            onChange={(e) =>
              setEditStock({ ...editStock, productQuantity: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Kapat
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
