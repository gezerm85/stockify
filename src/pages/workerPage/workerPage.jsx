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
import Logout from '../../components/Logout/Logout'

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

        // Initialize sales count
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

  const handleSale = async (id) => {
    const newSalesCount = sales[id] + 1;
    setSales((prevSales) => ({ ...prevSales, [id]: newSalesCount }));

    try {
      const coffeeDoc = doc(db, "coffees", id);
      await updateDoc(coffeeDoc, { sales: newSalesCount });
    } catch (error) {
      console.error("Error updating sales: ", error);
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
                  <TableCell align="center"> {recipe?.roomStockNumber}</TableCell>
                  <TableCell align="center">{recipe?.coffeeName}</TableCell>
                  <TableCell align="center">{recipe?.coffeeAmount}</TableCell>
                  <TableCell align="center">{recipe?.coffeeUnit}</TableCell>
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
                <TableCell colSpan={7} align="center" sx={{ fontWeight: "bold", color: "#ff0000" }}>
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
