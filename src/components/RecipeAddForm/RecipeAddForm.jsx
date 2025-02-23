/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const unitOptions = [
  { value: "gr", label: "Gram" },
  { value: "kg", label: "Kilogram" },
  { value: "ml", label: "Mililitre" },
  { value: "lt", label: "Litre" },
  { value: "pump", label: "Pompa" },
];

const RecipeAddForm = () => {
  const [stockData, setStockData] = useState([]);
  const [recipeName, setRecipeName] = useState("");
  const [mainIngredient, setMainIngredient] = useState({
    stockCode: "",
    productName: "",
    amount: "",
    unit: "gr",
  });
  const [extras, setExtras] = useState([]);

  // Firestore'dan "urunler" koleksiyonundaki stok verilerini çekiyoruz
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "urunler"));
        const stocks = querySnapshot.docs.map((doc) => ({
          stockCode: doc.id,
          ...doc.data(),
        }));
        setStockData(stocks);
      } catch (error) {
        console.error("Stok verileri yüklenirken hata oluştu:", error);
      }
    };

    fetchStockData();
  }, []);

  // Ekstra malzeme ekleme
  const handleAddExtra = () => {
    setExtras([
      ...extras,
      { id: Date.now(), stockCode: "", productName: "", amount: "", unit: "gr" },
    ]);
  };

  // Ekstra malzeme kaldırma
  const handleRemoveExtra = (id) => {
    setExtras(extras.filter((extra) => extra.id !== id));
  };

  // Ekstra malzeme düzenleme
  const handleExtraChange = (id, field, value) => {
    setExtras(
      extras.map((extra) =>
        extra.id === id ? { ...extra, [field]: value } : extra
      )
    );
  };

  // Form gönderimi: Reçete verilerini "recipes" koleksiyonuna ekliyoruz
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase Auth üzerinden oturum açmış kullanıcıyı alıyoruz
      const auth = getAuth();
      const currentUser = auth.currentUser;
      let createdByData = "anonymous";

      if (currentUser) {
        // Kullanıcının Firestore'daki "users" koleksiyonundaki dokümanını çekiyoruz
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          createdByData = userDocSnap.data();
        } else {
          // Eğer "users" koleksiyonunda doküman yoksa, currentUser bilgisini kullanıyoruz
          createdByData = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email,
          };
        }
      }

      const recipeData = {
        recipeName: recipeName,
        mainIngredient: mainIngredient,
        extras: extras.map(({ id, ...extra }) => extra), // id hariç diğer tüm alanlar
        createdAt: new Date(),
        createdBy: createdByData,
      };

      // addDoc kullanılarak otomatik benzersiz belge ID'si oluşturuluyor
      await addDoc(collection(db, "recipes"), recipeData);
      alert("Reçete başarıyla eklendi!");

      // Form sıfırlama
      setRecipeName("");
      setMainIngredient({ stockCode: "", productName: "", amount: "", unit: "gr" });
      setExtras([]);
    } catch (error) {
      console.error("Veri eklenirken hata oluştu:", error);
      alert("Reçete eklenirken bir hata oluştu.");
    }
  };

  if (stockData.length === 0) {
    return <p className="text-center text-gray-600">Stok verileri yükleniyor...</p>;
  }

  return (
    <div className="bg-gray-50 p-6 max-w-xl mx-auto mt-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Yeni Reçete Ekle
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reçete İsmi */}
        <div>
          <label className="block text-gray-700 mb-1">Reçete İsmi</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            placeholder="Reçete ismini giriniz"
            required
          />
        </div>

        {/* Ana Malzeme Seçimi */}
        <div>
          <label className="block text-gray-700 mb-1">Ana Malzeme</label>
          <select
            className="w-full border border-gray-300 p-2 rounded bg-white"
            value={mainIngredient.stockCode}
            onChange={(e) => {
              const selectedCode = e.target.value;
              const selectedStock = stockData.find(
                (item) => item.stockCode === selectedCode
              );
              setMainIngredient({
                ...mainIngredient,
                stockCode: selectedCode,
                productName: selectedStock ? selectedStock.productName : "",
              });
            }}
            required
          >
            <option value="">Malzeme seçiniz</option>
            {stockData.map((item) => (
              <option key={item.stockCode} value={item.stockCode}>
                {item.productName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Miktar</label>
            <input
              type="number"
              className="w-full border border-gray-300 p-2 rounded"
              value={mainIngredient.amount}
              onChange={(e) =>
                setMainIngredient({ ...mainIngredient, amount: e.target.value })
              }
              placeholder="Miktar"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Birim</label>
            <select
              className="w-full border border-gray-300 p-2 rounded bg-white"
              value={mainIngredient.unit}
              onChange={(e) =>
                setMainIngredient({ ...mainIngredient, unit: e.target.value })
              }
              required
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ekstra Malzemeler */}
        {extras.map((extra) => (
          <div
            key={extra.id}
            className="grid grid-cols-12 gap-4 items-center border-t border-gray-200 pt-4"
          >
            <div className="col-span-4">
              <label className="block text-gray-700 mb-1">Ekstra Malzeme</label>
              <select
                className="w-full border border-gray-300 p-2 rounded bg-white"
                value={extra.stockCode}
                onChange={(e) =>
                  handleExtraChange(extra.id, "stockCode", e.target.value)
                }
                required
              >
                <option value="">Malzeme seçiniz</option>
                {stockData.map((item) => (
                  <option key={item.stockCode} value={item.stockCode}>
                    {item.productName}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-3">
              <label className="block text-gray-700 mb-1">Miktar</label>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded"
                value={extra.amount}
                onChange={(e) =>
                  handleExtraChange(extra.id, "amount", e.target.value)
                }
                placeholder="Miktar"
                required
              />
            </div>
            <div className="col-span-3">
              <label className="block text-gray-700 mb-1">Birim</label>
              <select
                className="w-full border border-gray-300 p-2 rounded bg-white"
                value={extra.unit}
                onChange={(e) =>
                  handleExtraChange(extra.id, "unit", e.target.value)
                }
                required
              >
                {unitOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex justify-center">
              <button
                type="button"
                onClick={() => handleRemoveExtra(extra.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}

        {/* Ekstra Malzeme Ekle Butonu */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddExtra}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            <FaPlusCircle size={20} />
            <span>Ekstra Malzeme Ekle</span>
          </button>
        </div>

        {/* Kaydet Butonu */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-semibold"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecipeAddForm;
