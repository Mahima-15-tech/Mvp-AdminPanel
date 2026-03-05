import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const USERS_PER_PAGE = 10;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);
const [progress, setProgress] = useState(0);
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GLOBAL SEARCH ---------------- */

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search) ||
        u._id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(start, start + USERS_PER_PAGE);
  }, [filteredUsers, page]);

  /* ---------------- BAN / UNBAN ---------------- */

 /* ---------------- BAN / UNBAN ---------------- */

 const toggleBan = async (user) => {
  try {
    setActionLoading(user._id);

    if (user.isBanned) {
      await api.patch(`/admin/users/${user._id}/unban`);
    } else {
      await api.patch(
        `/admin/users/${user._id}/ban`,
        { reason: "Admin action" }
      );
    }

    await fetchUsers();

    setToast("User status updated");
    setTimeout(() => setToast(null), 2500);

  } catch (err) {
    console.error(err);
  } finally {
    setActionLoading(null);
    setConfirmUser(null);
  }
};

  /* ---------------- EXPORT PDF ---------------- */

  const exportPDF = async () => {
    try {
      setExportLoading(true);
  
      const response = await api.get("/admin/users/export-full", {
        params: {
          from: fromDate,
          to: toDate,
        },
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            );
            setProgress(percent);
          }
        },
      });
  
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );
  
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Enterprise-User-Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
    } catch (err) {
      console.error(err);
    } finally {
      setExportLoading(false);
      setProgress(0);
    }
  };

  /* ---------------- DATE HELPERS ---------------- */

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB");

  const daysAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Joined today";
    if (days === 1) return "Joined 1 day ago";
    return `Joined ${days} days ago`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBanned).length;
const bannedUsers = users.filter((u) => u.isBanned).length;
return (
  <div className="min-h-screen">

    <div className="max-w-7xl mx-auto space-y-10">

      {/* PREMIUM TOOLBAR */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-6 flex flex-wrap justify-between gap-6 items-center">

        <div className="flex flex-wrap items-center gap-4">

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="px-5 py-2.5 w-72 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm"
          />

          <button
            onClick={fetchUsers}
            className="p-3 rounded-2xl bg-white shadow hover:shadow-md transition"
          >
            <FiRefreshCw />
          </button>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-2xl shadow-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-200 px-4 py-2 rounded-2xl shadow-sm"
          />

          <button
            onClick={exportPDF}
            disabled={exportLoading}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:scale-105 transition"
          >
            {exportLoading ? `Generating ${progress}%` : "Export Report"}
          </button>

        </div>
      </div>

      {/* FLOATING STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatBox title="Total Users" value={totalUsers} color="indigo" />
        <StatBox title="Active Users" value={activeUsers} color="green" />
        <StatBox title="Banned Users" value={bannedUsers} color="red" />
      </div>

      {/* PREMIUM TABLE */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-8 py-5 text-left">ID</th>
              <th className="px-8 py-5 text-left">User</th>
              <th className="px-8 py-5 text-left">Plan</th>
              <th className="px-8 py-5 text-left">Credits</th>
              <th className="px-8 py-5 text-left">Joined</th>
              <th className="px-8 py-5 text-left">Check-in</th>
              <th className="px-8 py-5 text-left">Alerts</th>
              <th className="px-8 py-5 text-left">Status</th>
              <th className="px-8 py-5 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {paginatedUsers.map((user) => (

              <tr
                key={user._id}
                className="group hover:bg-indigo-50 transition duration-200 cursor-pointer"
              >

                <td
                  className="px-8 py-6 font-mono text-xs text-gray-500"
                  onClick={() => navigate(`/users/${user._id}`)}
                >
                  #{user._id.slice(-6).toUpperCase()}
                </td>

                <td
                  className="px-8 py-6"
                  onClick={() => navigate(`/users/${user._id}`)}
                >
                  <div className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                    {user.name || "Unnamed"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user.phone}
                  </div>
                </td>

                <td className="px-8 py-6 text-gray-600">
                  {user.subscription?.planType || "No Active Plan"}
                </td>

                <td className="px-8 py-6 font-semibold text-indigo-600">
                  {user.currentBalance ?? user.credits ?? 0}
                </td>

                <td className="px-8 py-6 text-sm text-gray-500">
                  <div>{formatDate(user.createdAt)}</div>
                  <div className="text-xs text-gray-400">
                    {daysAgo(user.createdAt)}
                  </div>
                </td>
                <td className="px-8 py-6">
  {user.checkin?.checkInTimes?.length ? (
    user.checkin.checkInTimes.map((t, i) => (
      <span
        key={i}
        className="px-2 py-1 mr-2 bg-indigo-100 text-indigo-700 rounded-full text-xs"
      >
        {t}
      </span>
    ))
  ) : "—"}
</td>
                <td className="px-8 py-6 font-medium">
                  {user.alertsCount ?? 0}
                </td>

                <td className="px-8 py-6">
                  <StatusBadge status={user.isBanned ? "banned" : "active"} />
                </td>

                <td className="px-8 py-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmUser(user);
                    }}
                    className={`px-5 py-2 rounded-2xl text-xs font-semibold transition shadow ${
                      user.isBanned
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {actionLoading === user._id
                      ? "..."
                      : user.isBanned
                      ? "Unban"
                      : "Ban"}
                  </button>
                </td>

              </tr>

            ))}

          </tbody>
        </table>
      </div>

      {/* PREMIUM PAGINATION */}
      <div className="flex justify-center items-center gap-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-5 py-2 rounded-2xl border bg-white shadow hover:shadow-md transition disabled:opacity-40"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-5 py-2 rounded-2xl border bg-white shadow hover:shadow-md transition disabled:opacity-40"
        >
          Next
        </button>
      </div>

    </div>

    {confirmUser && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white rounded-3xl shadow-2xl w-96 p-8">

          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Confirm Action
          </h3>

          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to{" "}
            <span className="font-semibold">
              {confirmUser.isBanned ? "Unban" : "Ban"}
            </span>{" "}
            this user?
          </p>

          <div className="flex justify-end gap-3">

            <button
              onClick={() => setConfirmUser(null)}
              className="px-5 py-2 rounded-xl border hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={() => toggleBan(confirmUser)}
              disabled={actionLoading === confirmUser._id}
              className="px-5 py-2 rounded-xl bg-gray-900 text-white hover:bg-black transition disabled:opacity-50"
            >
              {actionLoading === confirmUser._id
                ? "Processing..."
                : "Confirm"}
            </button>

          </div>
        </div>
      </div>
    )}

    {/* TOAST ALSO INSIDE RETURN */}
    {toast && (
      <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg">
        {toast}
      </div>
    )}

  
  </div>
);
}


/* ---------- COMPONENTS ---------- */

function StatBox({ title, value, color }) {

  const colors = {
    indigo: "text-indigo-600",
    green: "text-green-600",
    red: "text-red-600"
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition">
      <p className="text-xs uppercase tracking-widest text-gray-400">
        {title}
      </p>
      <p className={`text-4xl font-bold mt-3 ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    active: "bg-green-100 text-green-700",
    banned: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs ${colors[status]}`}>
      {status}
    </span>
  );
}