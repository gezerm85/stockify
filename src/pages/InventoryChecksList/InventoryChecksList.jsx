import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

export default function InventoryChecksList() {
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    const fetchInventoryChecks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "inventoryChecks"));
        const fetchedChecks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChecks(fetchedChecks);
      } catch (error) {
        console.error("Sayım kayıtları çekilirken hata oluştu:", error);
      }
    };

    fetchInventoryChecks();
  }, []);

  return (
    <Box sx={{ padding: 4, marginTop: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
        Sayım Geçmişi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#263238" }}>
            <TableRow>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Ürün Kodu</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Ürün Adı</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Depo Miktarı</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Sayım Miktarı</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Fark</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Durum</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Sayımı Yapan</TableCell>
              <TableCell sx={{ color: "#ffffff", textAlign: "center" }}>Zaman</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checks.length > 0 ? (
              checks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell align="center">{check.productCode}</TableCell>
                  <TableCell align="center">{check.productName}</TableCell>
                  <TableCell align="center">{check.expectedAmount}</TableCell>
                  <TableCell align="center">{check.countedAmount}</TableCell>
                  <TableCell align="center">
                    {check.difference > 0 ? `+${check.difference}` : check.difference}
                  </TableCell>
                  <TableCell align="center">{check.status}</TableCell>
                  <TableCell align="center">{check.checkedBy}</TableCell>
                  <TableCell align="center">
                    {check.timestamp?.toDate().toLocaleString() || ""}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{ fontWeight: "bold", color: "#ff0000" }}
                >
                  Sayım kaydı bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
