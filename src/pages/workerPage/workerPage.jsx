/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  writeBatch,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase";

// Satış periyodu seçenekleri (isteğe bağlı, burada örnek olarak ekleyebilirsiniz)
const salesPeriodOptions = [
  { value: "günlük", label: "Günlük" },
  { value: "haftalık", label: "Haftalık" },
  { value: "aylık", label: "Aylık" },
];

// Dönüşüm fonksiyonu: Eğer reçetede tanımlı birim ile depo ürününün birimi farklı ise dönüşüm yapar.
// Örneğin, 1 kg = 1000 gr, 1 lt = 1000 ml.
function convertAmount(amount, fromUnit, toUnit) {
  if (fromUnit === toUnit) return amount;
  if (fromUnit === "gr" && toUnit === "kg") return amount / 1000;
  if (fromUnit === "kg" && toUnit === "gr") return amount * 1000;
  if (fromUnit === "ml" && toUnit === "lt") return amount / 1000;
  if (fromUnit === "lt" && toUnit === "ml") return amount * 1000;
  return amount;
}

const SalesPage = () => {
  // State'ler
  const [salesPeriod, setSalesPeriod] = useState("günlük");
  const [recipes, setRecipes] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [saleQuantities, setSaleQuantities] = useState({}); // reçete id => satış adedi (number)
  const [loading, setLoading] = useState(false);

  // Reçeteleri Firestore'dan çekiyoruz (recipes koleksiyonu)
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecipes(recs);
      } catch (error) {
        console.error("Reçeteler çekilirken hata:", error);
      }
    };
    fetchRecipes();
  }, []);

  // Depo verilerini Firestore'dan çekiyoruz (urunler koleksiyonu)
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
        console.error("Depo verileri çekilirken hata:", error);
      }
    };
    fetchStockData();
  }, []);

  // Satış adedi inputundaki değişikliği state'e kaydet
  const handleSaleQuantityChange = (recipeId, value) => {
    setSaleQuantities((prev) => ({
      ...prev,
      [recipeId]: value,
    }));
  };

  // Toplu satış işlemi
  const handleSales = async () => {
    // Filtrele: sadece satış adedi girilmiş reçeteler üzerinde işlem yap
    const recipesToSell = recipes.filter((r) => {
      const qty = parseInt(saleQuantities[r.id]);
      return !isNaN(qty) && qty > 0;
    });

    if (recipesToSell.length === 0) {
      alert("Lütfen en az bir reçete için geçerli satış adedi giriniz.");
      return;
    }

    setLoading(true);

    try {
      // Toplu batch işlemi oluşturacağız
      const batch = writeBatch(db);
      const salesRecords = [];

      // Her bir reçete için
      for (const recipe of recipesToSell) {
        const saleQty = parseInt(saleQuantities[recipe.id]);
        if (isNaN(saleQty) || saleQty <= 0) continue;

        // ingredientsUsage: her bir malzeme için kullanılacak miktar hesaplanıyor.
        const usageUpdates = [];

        // Ana malzeme
        if (recipe.mainIngredient) {
          const main = recipe.mainIngredient;
          const ingredientUsage = saleQty * parseFloat(main.amount); // Reçetede tanımlı miktar * satış adedi
          // Depodaki ürün birimi ile reçetedeki birim farklı olabilir; onu dönüştürüyoruz:
          // Öncelikle, ilgili depo ürününü buluyoruz:
          const stockItem = stockData.find(
            (item) => item.stockCode === main.stockCode
          );
          if (stockItem) {
            const convertedUsage = convertAmount(
              ingredientUsage,
              main.unit,
              stockItem.unit
            );
            usageUpdates.push({
              stockCode: main.stockCode,
              usage: convertedUsage,
            });
          }
        }
        // Ekstra malzemeler
        if (recipe.extras && recipe.extras.length > 0) {
          for (const extra of recipe.extras) {
            const ingredientUsage = saleQty * parseFloat(extra.amount);
            const stockItem = stockData.find(
              (item) => item.stockCode === extra.stockCode
            );
            if (stockItem) {
              const convertedUsage = convertAmount(
                ingredientUsage,
                extra.unit,
                stockItem.unit
              );
              usageUpdates.push({
                stockCode: extra.stockCode,
                usage: convertedUsage,
              });
            }
          }
        }

        // Oluşturulacak satış kaydı (her reçete için bir kayıt)
        const saleRecord = {
          salesPeriod,
          recipeId: recipe.id,
          recipeName: recipe.recipeName,
          saleQuantity: saleQty,
          ingredientsUsage: usageUpdates, // hangi ürün kodundan ne kadar kullanıldı
          timestamp: new Date(),
        };
        salesRecords.push(saleRecord);
      }

      // Satış kaydını "sales" koleksiyonuna ekleyelim (her bir reçete için ayrı kayıt)
      for (const record of salesRecords) {
        await addDoc(collection(db, "sales"), record);
      }

      // Depo stoklarını güncelle (batch ile)
      for (const upd of salesRecords.flatMap((r) => r.ingredientsUsage)) {
        const productRef = doc(db, "urunler", upd.stockCode);
        // Stoğu düşürüyoruz: decrement (negatif değer)
        batch.update(productRef, { productQuantity: increment(-upd.usage) });
      }
      await batch.commit();

      alert("Satış başarıyla gerçekleştirildi!");
      // İşlem tamamlandığında inputları sıfırla
      setSaleQuantities({});
    } catch (error) {
      console.error("Satış işlemi hatası:", error);
      alert("Satış işlemi sırasında hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Satış İşlemi</h1>

        {/* Satış Periyodu Seçimi */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Satış Periyodu</label>
          <select
            value={salesPeriod}
            onChange={(e) => setSalesPeriod(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded bg-white"
          >
            {salesPeriodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reçete Listesi */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Reçeteler</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-2 text-center">Reçete İsmi</th>
                  <th className="px-4 py-2 text-center">Ana Malzeme</th>
                  <th className="px-4 py-2 text-center">Ekstra Malzemeler</th>
                  <th className="px-4 py-2 text-center">Satış Adedi</th>
                </tr>
              </thead>
              <tbody>
                {recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <tr key={recipe.id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-3 text-center">{recipe.recipeName}</td>
                      <td className="px-4 py-3 text-center">
                        {recipe.mainIngredient
                          ? `${recipe.mainIngredient.productName} (${recipe.mainIngredient.amount} ${recipe.mainIngredient.unit})`
                          : "Yok"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {recipe.extras && recipe.extras.length > 0 ? (
                          recipe.extras.map((ex, i) => (
                            <div key={i}>
                              {ex.productName} ({ex.amount} {ex.unit})
                            </div>
                          ))
                        ) : (
                          "Yok"
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          className="w-20 border border-gray-300 p-1 rounded text-center"
                          placeholder="Adet"
                          value={saleQuantities[recipe.id] || ""}
                          onChange={(e) =>
                            handleSaleQuantityChange(recipe.id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-3 text-center text-red-500 font-semibold"
                    >
                      Reçete bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Satış Yap Butonu */}
        <div className="flex justify-end">
          <button
            onClick={handleSales}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "İşlem Yapılıyor..." : "Satış Yap"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
