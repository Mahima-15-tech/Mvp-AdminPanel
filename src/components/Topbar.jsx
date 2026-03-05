import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { pageTitles } from "../config/pageTitles";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "../utils/auth";

export default function Topbar({ darkMode, setDarkMode }) {
  const location = useLocation();

  let currentPage = pageTitles[location.pathname];

  if (!currentPage) {
  
    if (location.pathname.startsWith("/users/")) {
      currentPage = {
        title: "User Details",
        subtitle: "View and manage user information"
      };
    }
  
    else if (location.pathname.startsWith("/support")) {
      currentPage = {
        title: "Support Tickets",
        subtitle: "Manage customer queries"
      };
    }
  
    else {
      currentPage = {
        title: "Admin Panel",
        subtitle: ""
      };
    }
  }

    const navigate = useNavigate();

const handleLogout = () => {
  logoutAdmin();
  navigate("/");
};

const [open, setOpen] = useState(false);
const dropdownRef = useRef(null);

useEffect(() => {
  function handleClickOutside(event) {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div
      className={`flex justify-between items-center px-8 py-6 transition-all duration-300 ${
        darkMode
          ? "bg-[#0B1220] border-b border-gray-800 text-white"
          : "bg-white border-b border-gray-300 text-gray-800"
      }`}
    >
      {/* Dynamic Title */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {currentPage.title}
        </h2>
        <p
          className={`text-xs mt-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {currentPage.subtitle}
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative w-14 h-7 flex items-center rounded-full p-1 transition-all duration-300 ${
            darkMode ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 flex items-center justify-center ${
              darkMode ? "translate-x-7" : "translate-x-0"
            }`}
          >
            {darkMode ? (
              <Moon size={14} className="text-indigo-600" />
            ) : (
              <Sun size={14} className="text-yellow-500" />
            )}
          </div>
        </button>

        <div className="relative" ref={dropdownRef}>

<div
  onClick={() => setOpen(!open)}
  className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow cursor-pointer hover:scale-105 transition"
>
  A
</div>

{open && (
  <div className={`absolute right-0 mt-3 w-40 rounded-xl shadow-xl border transition-all duration-200 ${
    darkMode
      ? "bg-[#111827] border-gray-700 text-white"
      : "bg-white border-gray-200 text-gray-800"
  }`}>
    
    <button
      onClick={handleLogout}
      className={`w-full text-left px-4 py-3 text-sm rounded-xl transition ${
        darkMode
          ? "hover:bg-gray-700"
          : "hover:bg-gray-100"
      }`}
    >
      Sign Out
    </button>

  </div>
)}

</div>
      </div>
    </div>
  );
}