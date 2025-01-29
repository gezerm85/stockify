import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

const CoffeeAddForm = () => {
    const [coffeeName, setCoffeeName] = useState("");
    const [coffeeAmount, setCoffeeAmount] = useState("");
    const [coffeeUnit, setCoffeeUnit] = useState("gr");
    const [syrupAmount, setSyrupAmount] = useState("");
    const [pumpCount, setPumpCount] = useState("");

  const unitOptions = ["gr", "kg", "ml", "lt"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "coffees"), {
        coffeeName: coffeeName || "-",
        coffeeAmount: coffeeAmount || "-",
        coffeeUnit: coffeeUnit || "-",
        syrupAmount: syrupAmount || "-",
        pumpCount: pumpCount || "-",
        createdAt: new Date(),
      });
      alert("Coffee added successfully!");
      setCoffeeName("");
      setCoffeeAmount("");
      setCoffeeUnit("gr");
      setSyrupAmount("");
      setPumpCount("");
    } catch (error) {
      console.error("Error adding data: ", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Yeni Kahve Ekle</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Kahve İsmi</label>
          <input
            type="text"
            value={coffeeName}
            onChange={(e) => setCoffeeName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4 flex gap-2">
          <div className="flex-1">
            <label className="block text-gray-700">Kahve Miktarı</label>
            <input
              type="number"
              value={coffeeAmount}
              onChange={(e) => setCoffeeAmount(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Unit</label>
            <select
              value={coffeeUnit}
              onChange={(e) => setCoffeeUnit(e.target.value)}
              className="p-2 border rounded-md"
            >
              {unitOptions.map((unit, index) => (
                <option key={index} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Şurup Miktarı (ml)</label>
          <input
            type="number"
            value={syrupAmount}
            onChange={(e) => setSyrupAmount(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Pompa Sayısı</label>
          <input
            type="number"
            value={pumpCount}
            onChange={(e) => setPumpCount(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default CoffeeAddForm;
