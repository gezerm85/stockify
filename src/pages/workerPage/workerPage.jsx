import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
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
} from "@mui/material";
import { Add, Remove, Search } from "@mui/icons-material";
import { getAuth } from "firebase/auth";
import Logout from "../../components/Logout/Logout";

// Yardımcı fonksiyon: Malzeme miktarını, reçete biriminden stok birimine çevirir
function convertAmount(amount, fromUnit, toUnit) {
  const amt = parseFloat(amount);
  if (!amt || !fromUnit || !toUnit) return amt;
  if (fromUnit.toLowerCase() === toUnit.toLowerCase()) return amt;
  // Ağırlık dönüşümü: gr <-> kg
  if (fromUnit.toLowerCase() === "gr" && toUnit.toLowerCase() === "kg") return amt / 1000;
  if (fromUnit.toLowerCase() === "kg" && toUnit.toLowerCase() === "gr") return amt * 1000;
  // Hacim dönüşümü: ml <-> lt
  if (fromUnit.toLowerCase() === "ml" && toUnit.toLowerCase() === "lt") return amt / 1000;
  if (fromUnit.toLowerCase() === "lt" && toUnit.toLowerCase() === "ml") return amt * 1000;
  // Bilinmeyen dönüşüm durumunda, olduğu gibi döndür
  return amt;
}

export default function WorkerPage() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState({});
  const [userRole, setUserRole] = useState(null); // Kullanıcı rolü durumu

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "coffees"));
        const fetchedRecipes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(fetchedRecipes);
        setFilteredRecipes(fetchedRecipes);

        // Başlangıç satış sayısını ayarla
        const initialSales = {};
        fetchedRecipes.forEach((recipe) => {
          initialSales[recipe.id] = recipe.sales || 0;
        });
        setSales(initialSales);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const fetchUserRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data().role);
          }
        } catch (error) {
          console.error("Kullanıcı rolü çekilirken hata:", error);
        }
      }
    };

    fetchRecipes();
    fetchUserRole();
  }, []);

  const handleSearch = () => {
    const filtered = recipes.filter((recipe) =>
      recipe.coffeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  // Satış işlemi: Firestore'da hem satış sayısı hem de stok güncellemesi yapılıyor.
  const handleSale = async (id) => {
    // Kullanıcının belirlediği satış adedini alıyoruz
    const saleCount = sales[id] || 0;
    if (saleCount <= 0) {
      console.warn("Satış sayısı 0, işlem yapılmadı.");
      return;
    }

    try {
      // İlgili reçeteyi bul
      const recipe = recipes.find((r) => r.id === id);
      if (!recipe) {
        console.error("Reçete bulunamadı");
        return;
      }

      // 1. Kahve dokümanındaki satış sayısını güncelle (önceki satış sayısına ekleyerek)
      const coffeeDocRef = doc(db, "coffees", id);
      const newTotalSales = (recipe.sales || 0) + saleCount;
      await updateDoc(coffeeDocRef, { sales: newTotalSales });

      // 2. Ana malzemenin (kahve) stoktan düşülmesi
      // Reçetede varsa 'coffeeAmount' ve 'coffeeUnit', yoksa mainIngredient üzerinden alıyoruz.
      const coffeeUsageAmount =
        recipe.coffeeAmount || (recipe.mainIngredient && recipe.mainIngredient.amount);
      const coffeeUsageUnit =
        recipe.coffeeUnit || (recipe.mainIngredient && recipe.mainIngredient.unit);
      const coffeeStockCode = recipe.mainIngredient && recipe.mainIngredient.stockCode;
      if (coffeeUsageAmount && coffeeUsageUnit && coffeeStockCode) {
        const stockDocRef = doc(db, "stock", coffeeStockCode);
        const stockSnap = await getDoc(stockDocRef);
        if (stockSnap.exists()) {
          const stockData = stockSnap.data();
          const currentQuantity = parseFloat(stockData.Quantity);
          // Reçetede belirtilen miktarı stok birimine çevir
          const usagePerSale = convertAmount(coffeeUsageAmount, coffeeUsageUnit, stockData.Unit);
          const totalUsage = saleCount * usagePerSale;
          const newQuantity = currentQuantity - totalUsage;
          await updateDoc(stockDocRef, { Quantity: newQuantity.toString() });
        } else {
          console.error("Stok dokümanı bulunamadı: ", coffeeStockCode);
        }
      }

      // 3. Şurup kullanımının stoktan düşülmesi (varsa)
      // Burada, reçetede 'syrupAmount' ve 'pumpCount' varsa ve extras dizisinde şurup bilgisi bulunuyorsa işleme alıyoruz.
      if (recipe.syrupAmount && recipe.pumpCount && recipe.extras && recipe.extras.length > 0) {
        const syrupExtra = recipe.extras[0];
        const syrupStockCode = syrupExtra.stockCode;
        const syrupUsageUnit = syrupExtra.unit; // Extras'tan gelen ölçü birimi
        // Toplam şurup kullanımı = reçetedeki şurup miktarı + (pompa sayısı * 2 ml)
        const baseSyrupAmount = parseFloat(recipe.syrupAmount);
        const pumpUsage = parseFloat(recipe.pumpCount) * 2; // Her pompa 2 ml
        const totalSyrupUsageRecipeUnit = baseSyrupAmount + pumpUsage;
        const stockDocRef = doc(db, "stock", syrupStockCode);
        const stockSnap = await getDoc(stockDocRef);
        if (stockSnap.exists()) {
          const stockData = stockSnap.data();
          const currentQuantity = parseFloat(stockData.Quantity);
          const usagePerSale = convertAmount(
            totalSyrupUsageRecipeUnit,
            syrupUsageUnit,
            stockData.Unit
          );
          const totalUsage = saleCount * usagePerSale;
          const newQuantity = currentQuantity - totalUsage;
          await updateDoc(stockDocRef, { Quantity: newQuantity.toString() });
        } else {
          console.error("Stok dokümanı bulunamadı: ", syrupStockCode);
        }
      }

      // İşlem tamamlandıktan sonra, satış adedini sıfırlıyoruz
      setSales((prevSales) => ({ ...prevSales, [id]: 0 }));
    } catch (error) {
      console.error("Satış işlemi sırasında hata:", error);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f4f6f9",
        borderRadius: 3,
        height: "100svh",
      }}
    >
      <div className="flex items-center justify-between">
        <Typography
          variant="h4"
          fontWeight={600}
          textAlign="center"
          mb={3}
          color="#37474f"
        >
          Kahve Reçeteleri
        </Typography>

        <Box display="flex" gap={2} justifyContent="center" mb={3}>
          <TextField
            label="Kahve İsmi Ara"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Search />}
            onClick={handleSearch}
          >
            Ara
          </Button>

          {/* Eğer kullanıcı worker rolüne sahipse Logout butonunu göster */}
          {userRole === "worker" && <Logout />}
        </Box>
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
                Stok No
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Kahve İsmi
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Kahve Miktarı
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Ölçü Birimi
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Şurup Miktarı
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Pompa Sayısı
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Satış Sayısı
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                Satış
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => (
                <TableRow
                  key={recipe.id}
                  sx={{ "&:hover": { backgroundColor: "#eceff1" } }}
                >
                  <TableCell align="center">
                    {recipe?.roomStockNumber}
                  </TableCell>
                  <TableCell align="center">{recipe?.coffeeName}</TableCell>
                  <TableCell align="center">
                    {recipe?.coffeeAmount ||
                      (recipe.mainIngredient && recipe.mainIngredient.amount)}
                  </TableCell>
                  <TableCell align="center">
                    {recipe?.coffeeUnit ||
                      (recipe.mainIngredient && recipe.mainIngredient.unit)}
                  </TableCell>
                  <TableCell align="center">{recipe?.syrupAmount}</TableCell>
                  <TableCell align="center">{recipe?.pumpCount}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() =>
                        setSales((prevSales) => ({
                          ...prevSales,
                          [recipe.id]: Math.max(
                            (prevSales[recipe.id] || 0) - 1,
                            0
                          ),
                        }))
                      }
                    >
                      <Remove />
                    </IconButton>
                    {sales[recipe.id] || 0}
                    <IconButton
                      onClick={() =>
                        setSales((prevSales) => ({
                          ...prevSales,
                          [recipe.id]: (prevSales[recipe.id] || 0) + 1,
                        }))
                      }
                    >
                      <Add />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleSale(recipe.id)}
                    >
                      Satış
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ fontWeight: "bold", color: "#ff0000" }}
                >
                  Bu ürün bulunamamaktadır.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}