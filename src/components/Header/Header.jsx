/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../Logout/Logout";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#263238] text-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Sol: Admin Panel */}
        <div className="w-1/3">
          <div
            className="cursor-pointer text-lg font-semibold whitespace-nowrap"
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </div>
        </div>

        {/* Ortada: Menü */}
        <div className="w-1/3 flex justify-center gap-6">
          <div className="cursor-pointer whitespace-nowrap" onClick={() => navigate("/worker")}>
            Satış 
          </div>
          <div className="cursor-pointer whitespace-nowrap" onClick={() => navigate("/stock")}>
            Stok
          </div>
          <div className="cursor-pointer whitespace-nowrap" onClick={() => navigate("/register")}>
            Kullanıcı ekle
          </div>
          {/* <div className="cursor-pointer whitespace-nowrap" onClick={() => navigate("/logs")}>
            Kullanıcı Hareketleri
          </div> */}
          <div className="cursor-pointer whitespace-nowrap" onClick={() => navigate("/census")}>
            Sayım
          </div>
        </div>

        {/* Sağ: Logout */}
        <div className="w-1/3 flex justify-end">
          <Logout />
        </div>
      </div>
    </header>
  );
};

export default Header;
