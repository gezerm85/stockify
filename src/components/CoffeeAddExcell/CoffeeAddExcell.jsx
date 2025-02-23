/* eslint-disable no-unused-vars */
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";

export default function CoffeeAddExcell() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Dosya seçimi için drag & drop işlemi
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
        setModalOpen(true);
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/vnd.ms-excel": [".xls", ".xlsx"] },
  });

  const handleSend = () => {
    console.log("Gönderilen Excel Verileri:", data);
    setModalOpen(false);
    // İleride backend entegrasyonu ekleyebilirsin.
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Excel Dosyası Yükle & Önizle
      </h1>

      {/* Dosya Seçme Alanı */}
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        className={`flex flex-col items-center justify-center border-4 border-dashed rounded-xl p-12 cursor-pointer transition-colors duration-300 shadow-lg ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <motion.p
            className="text-2xl font-semibold text-blue-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Dosyayı bırakın...
          </motion.p>
        ) : (
          <>
            <motion.svg
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ rotate: -15 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16V4m10 12V4M4 10h16"
              />
            </motion.svg>
            <motion.p
              className="text-xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Dosya seçmek için tıklayın ya da sürükleyin
            </motion.p>
            <motion.p
              className="mt-2 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Desteklenen dosya türleri: .xls, .xlsx
            </motion.p>
          </>
        )}
      </motion.div>

      {/* Modal ile Excel Önizleme */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-4"
              initial={{ y: "-50px", opacity: 0, scale: 0.9 }}
              animate={{ y: "0", opacity: 1, scale: 1 }}
              exit={{ y: "50px", opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-3xl font-semibold mb-6">Excel Önizleme</h2>
              <div className="overflow-auto max-h-96 border border-gray-200 rounded-lg">
                <table className="min-w-full text-left">
                  <thead className="bg-gray-100">
                    <tr>
                      {data.length > 0 &&
                        Object.keys(data[0]).map((key, index) => (
                          <th key={index} className="px-4 py-2 border-b">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 border-b">
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-8">
                <motion.button
                  onClick={() => setModalOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  className="mr-4 px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  İptal
                </motion.button>
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.05 }}
                  className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
                >
                  Gönder
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
