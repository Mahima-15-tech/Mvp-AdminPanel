import { useState } from "react";
import api from "../../api/axios";

export default function ChangePassword() {

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post("/admin/change-password", form);
      alert("Password updated successfully");
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Change Password
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <input
          type="password"
          placeholder="Current Password"
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={form.currentPassword}
          onChange={e => setForm({ ...form, currentPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="New Password"
          className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          value={form.newPassword}
          onChange={e => setForm({ ...form, newPassword: e.target.value })}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
}