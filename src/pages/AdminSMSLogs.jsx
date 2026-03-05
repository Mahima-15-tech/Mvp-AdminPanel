import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminSMSLogs() {

  const [logs, setLogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  const fetchLogs = async () => {
    const res = await api.get("/admin/sms-logs");
    setLogs(res.data.logs);
  };

  const filteredLogs = logs.filter(log => {
    if (statusFilter !== "ALL" && log.status !== statusFilter) return false;
    if (search && !log.recipientName.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-wrap justify-between gap-6 items-center">

          {/* SEARCH */}
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search recipient..."
              className="w-full border border-gray-300 rounded-xl pl-4 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* STATUS FILTER */}
          <div className="flex gap-3 flex-wrap">
            {["ALL", "SENT", "FAILED", "PENDING", "DELIVERED"].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Recipient</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Retry</th>
                <th className="px-6 py-4 text-left">Last Attempt</th>
                <th className="px-6 py-4 text-left">Failure</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map(log => (
                <tr
                  key={log._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-gray-800">
                      {log.recipientName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {log.recipientNumber}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-gray-600">
                    {log.type}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={log.status} />
                  </td>

                  <td className="px-6 py-5">
                    <RetryBadge
                      retry={log.retryCount}
                      max={log.maxRetries}
                    />
                  </td>

                  <td className="px-6 py-5 text-gray-500 text-sm">
                    {log.lastAttemptAt
                      ? new Date(log.lastAttemptAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-6 py-5 text-sm">
                    {log.failureReason ? (
                      <span className="text-red-500 font-medium">
                        {log.failureReason}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}