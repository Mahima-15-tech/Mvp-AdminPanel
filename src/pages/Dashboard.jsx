import { useEffect, useState } from "react";
import api from "../api/axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get("/admin/dashboard");
    setData(res.data);
  };

  if (!data) return <div className="p-10">Loading...</div>;

  const pieData = {
    labels: ["Trial", "Monthly Plan", "Yearly Plan"],
    datasets: [
      {
        data: [
          data.freeTrialUsers || 0,
          data.monthlyUsers || 0,
          data.yearlyUsers || 0,
        ],
        backgroundColor: [
          "#60A5FA",   // soft blue (trial)
          "#34D399",   // soft green (monthly)
          "#FBBF24",   // soft amber (yearly)
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        {/* <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Real-time system overview
          </p>
        </div> */}

        {/* KPI GRID */}
        <div className="grid md:grid-cols-4 gap-6">

          <PremiumCard title="Total Users" value={data.totalUsers} />
          <PremiumCard title="Active Subscriptions" value={data.activeSubscriptions} />
          <PremiumCard title="Alerts Today" value={data.alertsToday} />
          <PremiumCard title="Failed SMS (24h)" value={data.failedSMS} />

        </div>

        {/* SECOND ROW */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* PIE CHART */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">
              Subscription Distribution
            </h2>
            <div className="h-72">
            <Pie data={pieData} options={options} />
            </div>
          </div>

          {/* CREDIT / ALERT STATS */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
  <h2 className="text-xl font-semibold text-gray-800 mb-6">
    System Activity
  </h2>

  <div className="grid gap-4">

    <AdvancedStat 
      label="Credits Used Today"
      value={data.creditsUsedToday}
      accent="indigo"
    />

    <AdvancedStat 
      label="Retry In Progress"
      value={data.retryInProgress}
      accent="amber"
    />

    <AdvancedStat 
      label="Missed Check-ins Today"
      value={data.missedToday}
      accent="rose"
    />

    <AdvancedStat 
      label="SOS Triggers Today"
      value={data.sosToday}
      accent="emerald"
    />

  </div>
</div>

        </div>
      </div>
    </div>
  );
}

function PremiumCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold mt-3 text-gray-800">
        {value ?? 0}
      </p>
    </div>
  );
}

function AdvancedStat({ label, value, accent }) {
  const accents = {
    indigo: "bg-indigo-50 text-indigo-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-6 py-4 border border-gray-100 hover:shadow-md transition">

      <div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>

      <div
        className={`px-4 py-1 rounded-full font-semibold text-lg ${accents[accent]}`}
      >
        {value ?? 0}
      </div>

    </div>
  );
}