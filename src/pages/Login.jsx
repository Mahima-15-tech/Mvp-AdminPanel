import { useState } from "react";
import api from "../api/axios";
import { setAdminToken } from "../utils/auth";
import logo from "../assets/lightlogo.svg";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/admin/login", {
        email,
        password,
      });

      setAdminToken(res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      window.location.href = "/dashboard";

    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl p-10">

          <div className="flex justify-center mb-8">
            <img
              src={logo}
              alt="SoLo Admin"
              className="h-14 object-contain"
            />
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Admin Login
          </h1>

          <p className="text-sm text-gray-500 text-center mt-2 mb-8">
            Sign in to access the dashboard
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@solo.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 px-0 py-2 text-gray-700 border-b border-gray-300 focus:border-indigo-600 focus:outline-none transition bg-transparent"
              />
            </div>

            {/* Password with Eye Icon */}
            <div>
              <label className="text-sm text-gray-600">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-0 py-2 pr-10 text-gray-700 border-b border-gray-300 focus:border-indigo-600 focus:outline-none transition bg-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <NavLink
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-800 transition"
              >
                Forgot Password?
              </NavLink>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          © {new Date().getFullYear()} SoLo Admin Panel
        </p>

      </div>
    </div>
  );
}