import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminAlertMonitoring() {
  const [alerts, setAlerts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [plan, setPlan] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, [page, type, statusFilter, plan]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/alert-monitoring", {
        params: {
          page,
          type,
          status: statusFilter,
          plan,
          search,
        },
      });

      setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUMMARY STATS ================= */

  const total = alerts.length;
  const failed = alerts.filter(a => a.status === "FAILED").length;
  const pending = alerts.filter(a => a.status === "SMS_PENDING").length;
  const sent = alerts.filter(a => a.status === "SENT").length;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Alert Monitoring
          </h1>
          <p className="text-gray-500 mt-2">
            Real-time tracking of SOS & Missed Check-in alerts
          </p>
        </div> */}

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid md:grid-cols-4 gap-6">

          <StatCard label="Total Alerts" value={total} color="indigo" />
          <StatCard label="Sent" value={sent} color="green" />
          <StatCard label="Failed" value={failed} color="red" />
          <StatCard label="Pending" value={pending} color="yellow" />

        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="grid md:grid-cols-5 gap-4">

            <input
              type="text"
              placeholder="Search by phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={fetchAlerts}
              className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border rounded-xl px-4 py-2"
            >
              <option value="ALL">All Types</option>
              <option value="SOS">SOS</option>
              <option value="MISSED_CHECKIN">Missed Check-in</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-xl px-4 py-2"
            >
              <option value="ALL">All Status</option>
              <option value="SENT">Sent</option>
              <option value="FAILED">Failed</option>
              <option value="SMS_PENDING">Pending</option>
            </select>

            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="border rounded-xl px-4 py-2"
            >
              <option value="ALL">All Plans</option>
              <option value="TRIAL">Trial</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>

            <button
              onClick={() => {
                setType("ALL");
                setStatusFilter("ALL");
                setPlan("ALL");
                setSearch("");
                setPage(1);
                fetchAlerts();
              }}
              className="bg-gray-100 rounded-xl px-4 py-2 hover:bg-gray-200 transition"
            >
              Reset
            </button>

          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-gray-400">
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No alerts found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-gray-50 uppercase text-xs tracking-wide text-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-left">Plan</th>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Retries</th>
                    <th className="px-6 py-4 text-left">Contacts</th>
                    <th className="px-6 py-4 text-left">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {alerts.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">

                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {a.userName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {a.phone}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <PlanBadge plan={a.planType} />
                      </td>

                      <td className="px-6 py-4">
                        <TypeBadge type={a.alertType} />
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={a.status} />
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {a.retryCount}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {a.contactsCount}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(a.createdAt).toLocaleString()}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm"
          >
            Prev
          </button>

          <span className="text-gray-600">
            Page {page}
          </span>

          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ label, value, color }) {
  const styles = {
    indigo: "from-indigo-100 to-indigo-50 text-indigo-700",
    green: "from-green-100 to-green-50 text-green-700",
    red: "from-red-100 to-red-50 text-red-700",
    yellow: "from-yellow-100 to-yellow-50 text-yellow-700",
  };

  return (
    <div className={`bg-gradient-to-br ${styles[color]} rounded-3xl p-6 shadow`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function PlanBadge({ plan }) {
  const styles = {
    TRIAL: "bg-blue-100 text-blue-700",
    MONTHLY: "bg-emerald-100 text-emerald-700",
    YEARLY: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[plan] || "bg-gray-100 text-gray-600"}`}>
      {plan || "—"}
    </span>
  );
}

function TypeBadge({ type }) {
  const styles = {
    SOS: "bg-red-100 text-red-700",
    MISSED_CHECKIN: "bg-orange-100 text-orange-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[type] || "bg-gray-100 text-gray-600"}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    SENT: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    SMS_PENDING: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}