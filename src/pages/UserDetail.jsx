import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PastContactsModal from "../components/PastContactsModal";


/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/admin/users/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center text-lg text-gray-400">
        Loading user...
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-400">
        User not found
      </div>
    );

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                {data.basicInfo.name || "Unnamed User"}
              </h1>
              <p className="text-gray-500 mt-2">
                User ID: {data.basicInfo._id}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-3xl font-bold text-indigo-600">
                {data.currentBalance}
              </p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-3">
          {[
            "overview",
            "subscription",
            "subscription-history",
            "contacts",
            "checkin",
            "alerts",
            "credits",
            "admin-notes",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:shadow"
              }`}
            >
              {tab.replace("-", " ").toUpperCase()}
            </button>
          ))}
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
          {activeTab === "overview" && <Overview data={data} />}
          {activeTab === "subscription" && <Subscription data={data} />}
          {activeTab === "subscription-history" && (
            <SubscriptionHistory data={data} />
          )}
          {activeTab === "contacts" && <Contacts data={data} />}
          {activeTab === "checkin" && (
            <Checkin data={data} refresh={fetchUser} />
          )}
          {activeTab === "alerts" && <Alerts data={data} />}
          {activeTab === "credits" && (
            <Credits data={data} refresh={fetchUser} />
          )}
          {activeTab === "admin-notes" && (
            <AdminNotes data={data} refresh={fetchUser} />
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function SectionTitle({ children }) {
  return (
    <h2 className="text-2xl font-semibold mb-8 text-gray-800">
      {children}
    </h2>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="text-lg font-semibold mt-2 text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}

function ConsentBadge({ status }) {
  const map = {
    YES: "bg-green-100 text-green-700",
    STOP: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        map[status] || map["Pending"]
      }`}
    >
      {status}
    </span>
  );
}

function PremiumTable({ headers, children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-indigo-50 to-indigo-100 text-gray-700 uppercase text-xs">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-6 py-4 text-left font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {children}
        </tbody>
      </table>
    </div>
  );
}

/* =====================================================
   OVERVIEW
===================================================== */

function Overview({ data }) {
  const u = data.basicInfo;

  return (
    <>
      <SectionTitle>User Overview</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        <Info label="Phone" value={u.phone} />
        <Info label="Email" value={u.email} />
        <Info label="Gender" value={u.gender} />
        <Info label="Age" value={u.age} />
        <Info label="Location" value={u.profileLocation} />
        <Info label="Language" value={u.language} />
        <Info label="Alert Voice" value={u.alertVoice} />
        <Info
          label="Created At"
          value={new Date(u.createdAt).toLocaleString()}
        />
      </div>
    </>
  );
}

/* =====================================================
   SUBSCRIPTION
===================================================== */

function Subscription({ data }) {
  const s = data.subscription;
  if (!s) return <p>No active subscription</p>;

  return (
    <>
      <SectionTitle>Subscription Details</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6">
        <Info label="Plan Type" value={s.planType} />
        <Info label="Status" value={s.status} />
        <Info label="Auto Renew" value={s.autoRenew ? "Yes" : "No"} />
        <Info label="Credits Per Cycle" value={s.creditsPerCycle} />
        <Info
          label="Start Date"
          value={new Date(s.startDate).toLocaleDateString()}
        />
        <Info
          label="End Date"
          value={new Date(s.endDate).toLocaleDateString()}
        />
      </div>
    </>
  );
}

/* =====================================================
   SUBSCRIPTION HISTORY
===================================================== */

function SubscriptionHistory({ data }) {
  if (!data.subscriptionHistory?.length)
    return <p>No subscription changes found.</p>;

  return (
    <>
      <SectionTitle>Subscription History</SectionTitle>
      <div className="space-y-4">
        {data.subscriptionHistory.map((s) => (
          <div
            key={s._id}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm"
          >
            <p className="font-semibold text-gray-800">
              {s.previousPlan} → {s.newPlan}
            </p>
            <p className="text-gray-500 mt-1 text-sm">
              {new Date(s.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

/* =====================================================
   CONTACTS
===================================================== */

function Contacts({ data }) {

  const [showHistory, setShowHistory] = useState(false);
  const activeContacts = data.contacts?.filter(c => !c.removedAt);

  return (
    <>
      <div className="flex justify-between items-center">
        <SectionTitle>Active Contacts</SectionTitle>

        <button
          onClick={() => setShowHistory(true)}
          className="text-sm px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          View Past Contacts
        </button>
      </div>

      {!activeContacts?.length ? (
        <p className="text-gray-500">No active contacts</p>
      ) : (
        <PremiumTable
          headers={["Name", "Phone", "Relation", "Added On", "SMS Consent"]}
        >
          {activeContacts.map((c) => (
            <tr key={c._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium">{c.name}</td>
              <td className="px-6 py-4">{c.phone}</td>
              <td className="px-6 py-4">{c.relation}</td>
              <td className="px-6 py-4">
                {new Date(c.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <ConsentBadge status={c.consentStatus || "PENDING"} />
              </td>
            </tr>
          ))}
        </PremiumTable>
      )}

      {showHistory && (
        <PastContactsModal
          history={data.contactHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}

/* =====================================================
   ALERTS
===================================================== */

function Alerts({ data }) {
  const alerts = data.recentAlerts || [];

  if (!alerts.length)
    return <p className="text-gray-500">No alerts found.</p>;

  return (
    <>
      <SectionTitle>Recent Alerts</SectionTitle>

      <div className="space-y-6">
        {alerts.map((a) => (
          <div
            key={a._id}
            className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              
              {/* LEFT SIDE */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {a.type}
                </h3>

                <div className="flex gap-3 flex-wrap text-sm">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                    Status: {a.status}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    Credits: {a.creditsUsed}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    Retries: {a.retryCount}
                  </span>
                </div>

                {a.failureReason && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                    <strong>Failure Reason:</strong> {a.failureReason}
                  </div>
                )}

                {a.location && (
                  <div className="text-sm text-gray-600 mt-1">
                    📍 <strong>Location:</strong> {a.location.address}
                  </div>
                )}
              </div>

              {/* RIGHT SIDE DATE */}
              <div className="text-sm text-gray-400 whitespace-nowrap">
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* =====================================================
   CHECKIN
===================================================== */

function Checkin({ data, refresh }) {
  const c = data.checkin;
  if (!c) return <p>No check-in schedule set.</p>;

  const toggleStatus = async () => {
    await api.patch(`/admin/users/${data.basicInfo._id}/toggle-checkin`);
    refresh();
  };

  return (
    <>
      <SectionTitle>Check-in Details</SectionTitle>
      <div className="grid md:grid-cols-2 gap-6 mb-6">
      <Info
 label="Check-in Time"
 value={c.checkInTimes?.map(t => `${t}`).join(" / ")}
/>
        <Info label="Grace Minutes" value={c.graceMinutes} />
        <Info label="Status" value={c.status} />
        <Info
          label="Last Check-in"
          value={
            c.lastCheckInAt
              ? new Date(c.lastCheckInAt).toLocaleString()
              : "—"
          }
        />
      </div>

      <button
        onClick={toggleStatus}
        className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:shadow-lg transition"
      >
        {c.status === "PAUSED" ? "Resume Check-in" : "Pause Check-in"}
      </button>
    </>
  );
}

/* =====================================================
   CREDITS
===================================================== */

function Credits({ data, refresh }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const history = data.creditHistory || [];
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const paginatedData = history.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const adjustCredit = async () => {
    if (!amount) return;

    try {
      setLoading(true);
      await api.post(`/admin/users/${data.basicInfo._id}/adjust-credits`, {
        amount: Number(amount),
        reason: "ADMIN_ADJUSTMENT",
      });
      setAmount("");
      refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SectionTitle>Credit Management</SectionTitle>

      {/* SMALLER BALANCE CARD */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 mb-8 flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 uppercase">Current Balance</p>
          <p className="text-2xl font-semibold text-indigo-700">
            {data.currentBalance}
          </p>
        </div>
      </div>

      {/* ADJUST SECTION */}
      <div className="bg-white border rounded-xl p-6 shadow-sm mb-10">
        <h3 className="font-semibold mb-4">Adjust Credits</h3>

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="+100 or -50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border px-4 py-2 rounded-lg w-60 focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            onClick={adjustCredit}
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Apply"}
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <div>
        <h3 className="font-semibold mb-6 text-lg">Credit History</h3>

        {paginatedData.length === 0 && (
          <p className="text-gray-500">No credit transactions found.</p>
        )}

<div className="space-y-3">
  {paginatedData.map((c) => {

    // 🔥 FIXED LOGIC
    const deductReasons = ["MISSED_ALERT", "DEDUCT"];
    const isDeduct =
      deductReasons.includes(c.reason) ||
      c.type === "DEDUCT" ||
      c.amount < 0;

    const isAdd = !isDeduct;

    return (
      <div
        key={c._id}
        className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition"
      >
        <div className="flex justify-between items-center">

          {/* LEFT */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                  isAdd
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {isAdd ? "ADD" : "DEDUCT"}
              </span>

              <span className="text-sm font-medium text-gray-700">
                {c.reason}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>

          {/* RIGHT */}
          <div className="text-right">
            <p
              className={`text-lg font-semibold ${
                isAdd ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAdd ? "+" : "-"}
              {Math.abs(c.amount)}
            </p>

            <p className="text-xs text-gray-500">
              Balance: {c.balanceAfter}
            </p>
          </div>

        </div>
      </div>
    );
  })}
</div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded-lg disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}
      </div>
    </>
  );
}

/* =====================================================
   ADMIN NOTES
===================================================== */

function AdminNotes({ data, refresh }) {
  const [note, setNote] = useState("");

  const addNote = async () => {
    if (!note.trim()) return;
    await api.post(`/admin/users/${data.basicInfo._id}/notes`, { note });
    setNote("");
    refresh();
  };

  return (
    <>
      <SectionTitle>Admin Notes</SectionTitle>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add internal admin note..."
        className="w-full border border-gray-300 rounded-2xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <button
        onClick={addNote}
        className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:shadow-lg transition mb-6"
      >
        Add Note
      </button>

      <div className="space-y-4">
        {data.adminNotes?.map((n) => (
          <div
            key={n._id}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm"
          >
            <p>{n.note}</p>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}