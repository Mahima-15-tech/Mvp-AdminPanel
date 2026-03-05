import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout({ children, darkMode, setDarkMode }) {
  return (
<div
  className={`flex h-screen transition-colors duration-300 ${
    darkMode
      ? "bg-gray-900 text-gray-200"
      : "bg-gray-100 text-gray-800"
  }`}
>      <Sidebar darkMode={darkMode} />

      <div className="flex-1 flex flex-col">
        <Topbar darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}