import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AllUsersLogs() {
  const [users, setUsers] = useState([]); // Tüm kullanıcılar
  const [logs, setLogs] = useState({}); // Kullanıcıların logları

  // Firestore'dan tüm kullanıcıları çek
  useEffect(() => {
    const fetchUsersAndLogs = async () => {
      try {
        // Tüm kullanıcıları çek
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsers(usersList);

        // Her kullanıcı için logları çek
        const logsData = {};
        for (const user of usersList) {
          const logsRef = collection(db, `logs/users/${user.id}`);
          const logsSnapshot = await getDocs(logsRef);

          logsData[user.id] = logsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setLogs(logsData);
      } catch (error) {
        console.error("Kullanıcılar ve loglar alınırken hata:", error);
      }
    };

    fetchUsersAndLogs();
  }, []);

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f4f6f9", borderRadius: 3 }}>
      <Typography
        variant="h4"
        fontWeight={600}
        textAlign="center"
        mb={3}
        color="#37474f"
      >
        Tüm Kullanıcıların İşlem Geçmişi
      </Typography>

      {users.map((user) => (
        <Accordion key={user.id} sx={{ marginBottom: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>
              {user.username || "Bilinmeyen Kullanıcı"}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
                      İşlem
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
                      Eklenen Miktar
                    </TableCell>
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
                      Birim
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        textAlign: "center",
                      }}
                    >
                      Zaman
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs[user.id] && logs[user.id].length > 0 ? (
                    logs[user.id].map((log) => (
                      <TableRow
                        key={log.id}
                        sx={{ "&:hover": { backgroundColor: "#eceff1" } }}
                      >
                        <TableCell align="center">{log.action}</TableCell>
                        <TableCell align="center">{log.productName}</TableCell>
                        <TableCell align="center">{log.quantityAdded}</TableCell>
                        <TableCell align="center">{log.stockNumber}</TableCell>
                        <TableCell align="center">{log.unit}</TableCell>
                        <TableCell align="center">
                          {log.timestamp
                            ? new Date(log.timestamp.toDate()).toLocaleString()
                            : "Zaman bilgisi yok"}
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
                        İşlem geçmişi bulunamadı.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
