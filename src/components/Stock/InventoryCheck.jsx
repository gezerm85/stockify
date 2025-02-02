import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs,  addDoc } from "firebase/firestore";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { getAuth } from "firebase/auth";

export default function InventoryCheck() {
  const [products, setProducts] = useState([]);
  const [countedAmounts, setCountedAmounts] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "stock"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Ürünleri çekerken hata:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCountChange = (id, newAmount) => {
    setCountedAmounts((prev) => ({ ...prev, [id]: newAmount }));
  };

  const handleSaveCount = async (id, actualAmount) => {
    const product = products.find((p) => p.id === id);
    const expectedAmount = parseFloat(product.quantity);
    const countedAmount = parseFloat(actualAmount);

    if (isNaN(countedAmount)) {
      alert("Geçerli bir sayı giriniz.");
      return;
    }

    const difference = countedAmount - expectedAmount;

    try {
      await addDoc(collection(db, "inventoryChecks"), {
        productId: id,
        productName: product.productName,
        stockNumber: product.stockNumber,
        expectedAmount,
        countedAmount,
        difference,
        checkedBy: user ? user.email : "Bilinmeyen Kullanıcı",
        timestamp: new Date(),
      });

      alert(`Sayım kaydedildi! Fark: ${difference > 0 ? "+" : ""}${difference}`);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, quantity: countedAmount.toString() } : p
        )
      );
    } catch (error) {
      console.error("Sayım kaydedilirken hata oluştu:", error);
    }
  };

  return (
    <Box sx={{ padding: 4, borderRadius: 3, backgroundColor: "#ffffff", marginTop: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
        Depo Sayımı
      </Typography>
      <TableContainer sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#263238" }}>
            <TableRow>
              <TableCell sx={{ color: "#ffffff" }}>Ürün</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Stok Miktarı</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Fiziksel Sayım</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Fark</TableCell>
              <TableCell sx={{ color: "#ffffff" }}>Kaydet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const expectedAmount = parseFloat(product.quantity);
              const countedAmount = parseFloat(countedAmounts[product.id]) || 0;
              const difference = countedAmount - expectedAmount;

              return (
                <TableRow key={product.id}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.quantity} {product.unit}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={countedAmounts[product.id] || ""}
                      onChange={(e) => handleCountChange(product.id, e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>{difference > 0 ? `+${difference}` : difference}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleSaveCount(product.id, countedAmounts[product.id])}
                      color="primary"
                      variant="contained"
                      size="small"
                    >
                      Kaydet
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
