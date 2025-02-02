import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

const unitOptions = [
  { value: "gr", label: "Gram (gr)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "ml", label: "Mililitre (ml)" },
  { value: "lt", label: "Litre (lt)" },
];

export default function AddProduct() {
  const [product, setProduct] = useState({
    stockNumber: "",
    productName: "",
    quantity: "",
    unit: "gr",
  });

  const [userData, setUserData] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  // Kullanıcı adını Firestore'dan çek
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.error("Kullanıcı bilgisi çekilirken hata:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product.stockNumber || !product.productName || !product.quantity) {
      setSnackbarMessage("Lütfen tüm alanları doldurun!");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const stockRef = collection(db, "stock");
      const stockQuery = query(stockRef, where("stockNumber", "==", product.stockNumber));
      const stockSnapshot = await getDocs(stockQuery);

      if (!stockSnapshot.empty) {
        // Ürün zaten varsa, miktarı güncelle
        const existingProduct = stockSnapshot.docs[0]; // İlk bulunan ürünü al
        const existingData = existingProduct.data();
        const newQuantity = parseFloat(existingData.quantity) + parseFloat(product.quantity); // Mevcut miktara ekle

        await updateDoc(doc(db, "stock", existingProduct.id), {
          quantity: newQuantity.toString(),
          lastUpdatedBy: userData?.username || "Bilinmeyen Kullanıcı",
          lastUpdatedByEmail: user?.email || "Bilinmeyen E-posta",
          timestamp: new Date(),
        });

        setSnackbarMessage(`Mevcut ürün güncellendi! Yeni miktar: ${newQuantity}`);
      } else {
        // Ürün yoksa yeni ekle
        await addDoc(collection(db, "stock"), {
          ...product,
          addedBy: userData?.username || "Bilinmeyen Kullanıcı",
          addedByEmail: user?.email || "Bilinmeyen E-posta",
          timestamp: new Date(),
        });

        setSnackbarMessage("Yeni ürün başarıyla eklendi!");
      }

      // Kullanıcı işlemini loglara ekle
      await addDoc(collection(db, `logs/users/${user.uid}`), {
        action: "Ürün Eklendi",
        stockNumber: product.stockNumber,
        productName: product.productName,
        quantityAdded: parseFloat(product.quantity),
        unit: product.unit,
        timestamp: new Date(),
      });

      setSnackbarType("success");
      setSnackbarOpen(true);

      setProduct({
        stockNumber: "",
        productName: "",
        quantity: "",
        unit: "gr",
      });
    } catch (error) {
      setSnackbarMessage("Ürün eklenirken hata oluştu!");
      setSnackbarType("error");
      setSnackbarOpen(true);
      console.error("Ürün eklenirken hata oluştu:", error);
    }
  };

  return (
    <Box sx={{ padding: 4, borderRadius: 3, backgroundColor: "#ffffff", marginTop: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
        Yeni Ürün Ekle
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Stok Numarası" name="stockNumber" value={product.stockNumber} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Ürün Adı (Kahve veya Diğer)" name="productName" value={product.productName} onChange={handleChange} margin="normal" required />
        <TextField fullWidth label="Miktar" name="quantity" type="number" value={product.quantity} onChange={handleChange} margin="normal" required />
        <TextField select fullWidth label="Ölçü Birimi" name="unit" value={product.unit} onChange={handleChange} margin="normal" required>
          {unitOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button fullWidth type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Ürünü Ekle
        </Button>
      </form>

      {/* Material UI Snackbar Bildirimi */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarType} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
