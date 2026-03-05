import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Siren,
  Clock,
  MessageSquare,
  MessageCircle,
  Settings,
} from "lucide-react";

import logoDark from "../assets/lightlogo.svg";
import logoLight from "../assets/darklogo.svg";
import { isSuperAdmin } from "../utils/role";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import api from "../api/axios";


export default function Sidebar({ darkMode }) {
  const [openSettings, setOpenSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  async function fetchUnread() {
    try {
      const res = await api.get("/support/unread-count");
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error(err);
    }
  }

  fetchUnread();
}, []);
  return (
    <div
      className={`w-64 min-h-screen flex flex-col transition-all duration-300 ${
        darkMode
          ? "bg-[#0F172A] border-r border-gray-800  "
          : "bg-white border-r border-gray-800/20"
      }`}
    >
      {/* ===== LOGO ===== */}
      <div className={`h-25 flex items-center px-6   ${
        darkMode
          ? " border-b border-gray-800  "
          : " border-b border-gray-800/20"
      }`} >
        <img
          src={darkMode ? logoLight : logoDark}
          alt="SOLO Logo"
          className="h-12 object-contain"
        />
      </div>

      

      {/* ===== NAV ===== */}
      <nav className="flex-1 px-4 py-6 space-y-2 text-sm font-medium">

<SidebarItem to="/dashboard" label="Dashboard" icon={LayoutDashboard} darkMode={darkMode} />
<SidebarItem to="/users" label="Users" icon={Users} darkMode={darkMode} />
<SidebarItem to="/alerts" label="Alerts" icon={Siren} darkMode={darkMode} />
<SidebarItem to="/checkins" label="Check-ins" icon={Clock} darkMode={darkMode} />
<SidebarItem to="/sms-logs" label="SMS Logs" icon={MessageSquare} darkMode={darkMode} />
<SidebarItem
  to="/support"
  label="Support Tickets"
  icon={MessageCircle}
  darkMode={darkMode}
  badge={unreadCount}
/>

{isSuperAdmin() && (
  <div>
    <button
      onClick={() => setOpenSettings(!openSettings)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
        darkMode
          ? "text-gray-400 hover:text-white hover:bg-gray-800"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <Settings size={18} />
        <span>Settings</span>
      </div>

      <ChevronDown
        size={16}
        className={`transition-transform duration-300 ${
          openSettings ? "rotate-180" : ""
        }`}
      />
    </button>

    {openSettings && (
      <div className="ml-8 mt-2 space-y-1 text-sm border-l border-gray-300 pl-4">

        <SubItem to="/settings/profile" label="Profile" />
        <SubItem to="/settings/security" label="Security" />
        <SubItem to="/settings/admin-access" label="Admin Access" />
        <SubItem to="/settings/system-health" label="System Health" />

      </div>
    )}
  </div>
)}

</nav>



      {/* ===== FOOTER ===== */}
      <div
        className={`px-6 py-4 text-xs ${
          darkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        © {new Date().getFullYear()} SOLO Admin
      </div>
    </div>
  );
}

/* ===== SIDEBAR ITEM ===== */

function SidebarItem({ to, label, icon: Icon, darkMode, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
            : darkMode
            ? "text-gray-400 hover:text-white hover:bg-gray-800"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        <span>{label}</span>
      </div>

      {badge > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function SubItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block py-2 px-3 rounded-lg transition ${
          isActive
            ? "bg-indigo-50 text-indigo-600 font-medium"
            : "text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
}