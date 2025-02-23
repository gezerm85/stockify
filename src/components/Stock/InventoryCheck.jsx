import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc, addDoc } from "firebase/firestore";
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
  Select,
  MenuItem,
} from "@mui/material";
import { getAuth } from "firebase/auth";

const unitOptions = [
  { value: "gr", label: "gr" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "lt", label: "lt" },
];

// Dönüşüm fonksiyonu: Girilen miktarı, 'fromUnit'den 'toUnit'e çevirir (kg<->gr, lt<->ml için)
function convertAmount(amount, fromUnit, toUnit) {
  if (fromUnit === toUnit) return amount;
  if (fromUnit === "gr" && toUnit === "kg") return amount / 1000;
  if (fromUnit === "kg" && toUnit === "gr") return amount * 1000;
  if (fromUnit === "ml" && toUnit === "lt") return amount / 1000;
  if (fromUnit === "lt" && toUnit === "ml") return amount * 1000;
  return amount;
}

export default function InventoryCheck() {
  const [products, setProducts] = useState([]);
  const [countedAmounts, setCountedAmounts] = useState({});
  const [physicalUnits, setPhysicalUnits] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // "urunler" koleksiyonundan ürün verilerini çekiyoruz
        const querySnapshot = await getDocs(collection(db, "urunler"));
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
        // Varsayılan fiziksel sayım birimi, ürünün stok birimi olsun
        const initialUnits = {};
        fetchedProducts.forEach((p) => {
          initialUnits[p.id] = p.unit || "kg";
        });
        setPhysicalUnits(initialUnits);
      } catch (error) {
        console.error("Ürünleri çekerken hata oluştu:", error);
      }
    };

    fetchProducts();
  }, []);

  // Ürün koduna göre arama işlemi
  const handleSearch = () => {
    const filtered = products.filter((product) =>
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Fiziksel sayım için girilen değeri state'e kaydet
  const handleCountChange = (id, newAmount) => {
    setCountedAmounts((prev) => ({ ...prev, [id]: newAmount }));
  };

  // Fiziksel sayım birimi seçimini güncelle
  const handleUnitChange = (id, newUnit) => {
    setPhysicalUnits((prev) => ({ ...prev, [id]: newUnit }));
  };

  // Sayım kaydını Firebase'e gönder ve stok güncellemesi yap
  const handleSaveCount = async (id, actualAmount) => {
    const product = products.find((p) => p.id === id);
    const expectedAmount = parseFloat(product.productQuantity);
    const countedAmount = parseFloat(actualAmount);

    if (isNaN(countedAmount)) {
      alert("Lütfen geçerli bir sayı giriniz.");
      return;
    }

    // Seçilen fiziksel sayım birimini al; yoksa ürünün stok birimi
    const selectedUnit = physicalUnits[id] || product.unit;
    // Girilen miktarı, ürünün stok birimine dönüştür
    const convertedCount = convertAmount(countedAmount, selectedUnit, product.unit);
    const difference = convertedCount - expectedAmount;
    const status = difference > 0 ? "Fazla" : difference < 0 ? "Eksik" : "Tam";

    try {
      // Sayım geçmişini "inventoryChecks" koleksiyonuna ekle (bu veriler kullanıcıya gösterilmeyecek)
      await addDoc(collection(db, "inventoryChecks"), {
        productId: id,
        productCode: product.productCode,
        productName: product.productName,
        expectedAmount,
        countedAmount: convertedCount,
        difference,
        status,
        checkedBy: user ? user.email : "Bilinmeyen Kullanıcı",
        timestamp: new Date(),
      });

      // Stok güncellemesi: "urunler" koleksiyonundaki productQuantity güncelleniyor
      const productRef = doc(db, "urunler", id);
      await updateDoc(productRef, { productQuantity: convertedCount.toString() });

      alert("Sayım kaydedildi!");
      // Yerel state güncellemesi
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, productQuantity: convertedCount.toString() } : p
        )
      );
      setFilteredProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, productQuantity: convertedCount.toString() } : p
        )
      );
    } catch (error) {
      console.error("Sayım kaydedilirken hata oluştu:", error);
      alert("Sayım kaydedilirken bir hata oluştu.");
    }
  };

  return (
    <Box sx={{ padding: 4, borderRadius: 3, backgroundColor: "#ffffff", marginTop: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
        Depo Sayımı
      </Typography>

      {/* Arama Alanı */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Ürün Kodu ile Ara"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Ara
        </Button>
      </Box>

      <TableContainer sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#263238" }}>
            <TableRow>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Ürün Kodu</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Ürün Adı</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Fiziksel Sayım</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Kaydet</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell align="center">{product.productCode}</TableCell>
                  <TableCell align="center">{product.productName}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        type="number"
                        value={countedAmounts[product.id] || ""}
                        onChange={(e) => handleCountChange(product.id, e.target.value)}
                        size="small"
                      />
                      <Select
                        value={physicalUnits[product.id] || product.unit}
                        onChange={(e) => handleUnitChange(product.id, e.target.value)}
                        size="small"
                      >
                        {unitOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ fontWeight: "bold", color: "#ff0000" }}
                >
                  Ürün bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
