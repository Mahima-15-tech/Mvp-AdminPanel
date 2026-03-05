import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminCheckinMonitoring() {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [status]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/checkins", {
        params: { status, search }
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckin = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-checkin`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = data.filter(d => d.status === "ACTIVE").length;
  const pausedCount = data.filter(d => d.status === "PAUSED").length;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Check-in Monitoring
          </h1>
          <p className="text-gray-500 mt-2">
            Manage and monitor all active user check-ins
          </p>
        </div> */}

        {/* SUMMARY CARDS */}
        <div className="grid md:grid-cols-3 gap-6">

          <SummaryCard
            label="Active Check-ins"
            value={activeCount}
            color="green"
          />

          <SummaryCard
            label="Paused Check-ins"
            value={pausedCount}
            color="red"
          />

          <SummaryCard
            label="Total Check-ins"
            value={data.length}
            color="indigo"
          />

        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="grid md:grid-cols-3 gap-4">

            <input
              type="text"
              placeholder="Search by phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={fetchData}
              className="border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-xl px-4 py-2"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
            </select>

            <button
              onClick={() => {
                setStatus("ALL");
                setSearch("");
                fetchData();
              }}
              className="bg-gray-100 rounded-xl px-4 py-2 hover:bg-gray-200 transition"
            >
              Reset
            </button>

          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

          {loading ? (
            <div className="p-10 text-center text-gray-400">
              Loading check-ins...
            </div>
          ) : data.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              No check-in schedules found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-gray-50 uppercase text-xs tracking-wide text-gray-600">
                  <tr>
                    <th className="px-6 py-4 text-left">User</th>
                    <th className="px-6 py-4 text-left">Plan</th>
                    <th className="px-6 py-4 text-left">Check-in Time</th>
                    <th className="px-6 py-4 text-left">Grace</th>
                    <th className="px-6 py-4 text-left">Last Check-in</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">

                  {data.map((row) => (
                    <tr key={row._id} className="hover:bg-gray-50 transition">

                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-800">
                          {row.userName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {row.phone}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <PlanBadge plan={row.planType} />
                      </td>

                      <td className="px-6 py-4">
  {row.checkInTimes?.length ? (
    row.checkInTimes.map((t, i) => (
      <span
        key={i}
        className="px-2 py-1 mr-2 bg-indigo-100 text-indigo-700 rounded-full text-xs"
      >
        {t}
      </span>
    ))
  ) : (
    "—"
  )}
</td>

                      <td className="px-6 py-4 text-gray-700">
                        {row.graceMinutes} min
                      </td>

                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {row.lastCheckInAt
                          ? new Date(row.lastCheckInAt).toLocaleString()
                          : "—"}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={row.status} />
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleCheckin(row.userId)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                            row.status === "ACTIVE"
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {row.status === "ACTIVE" ? "Pause" : "Resume"}
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SummaryCard({ label, value, color }) {
  const colors = {
    green: "from-green-100 to-green-50 text-green-700",
    red: "from-red-100 to-red-50 text-red-700",
    indigo: "from-indigo-100 to-indigo-50 text-indigo-700",
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-3xl p-6 shadow`}>
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

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-green-100 text-green-700",
    PAUSED: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}