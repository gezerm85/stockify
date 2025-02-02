/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import AppRouter from "./Router/AppRouter";
import Header from "./components/Header/Header";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data().role);
          } else {
            console.error("Kullanıcı dokümanı bulunamadı!");
          }
        } catch (error) {
          console.error("Kullanıcı rolü çekilirken hata:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userRole === "admin" && <Header />} {/* Sadece admin rolü olanlar için Header gösterilir */}
      <AppRouter />
    </div>
  );
}

export default App;
