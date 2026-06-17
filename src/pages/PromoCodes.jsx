import { useState, useRef } from "react";
import CreatePromoModal from "../components/CreatePromoModal";
import api from "../api/axios";
import { useEffect } from "react";


export default function PromoCodes() {

  const [showModal, setShowModal] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  
const tableRef = useRef(null);

const scrollToTable = () => {
  tableRef.current?.scrollIntoView({ behavior: "smooth" });
};

//   const [data, setData] = useState([]);



  const [page, setPage] = useState(1);
  const perPage = 5;

  // 🔍 SEARCH FILTER
  const filteredData = (Array.isArray(data) ? data : [])
  .filter(d =>
    (d.emails?.join(", ") || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  )
  .filter(d => {
    if (status === "ALL") return true;
  
    if (status === "REDEEMED") return d.status === "Redeemed";
    if (status === "EXPIRED") return d.status === "Expired";
  
    if (status === "NOT_REDEEMED") {
      return d.status === "Not Redeemed";
    }
  
    if (status === "1M") return d.duration === "1 Month";
    if (status === "1Y") return d.duration === "1 Year";
    if (status === "UNLIMITED") return d.duration === "Unlimited";
  
    return true;
  });


const totalPages = Math.ceil(filteredData.length / perPage);

const safeTotalPages = totalPages > 0 ? totalPages : 1;
const safePage = Math.min(page, safeTotalPages);

const paginatedData = filteredData.slice(
  (safePage - 1) * perPage,
  safePage * perPage
);
useEffect(() => {
  setPage(1);
}, [search, status]);

const [stats, setStats] = useState({});
  const statusOptions = [
    { label: "All Status", value: "ALL" },
    { label: "1 Month", value: "1M" },
    { label: "1 Year", value: "1Y" },
    { label: "Unlimited", value: "UNLIMITED" },
    { label: "Redeemed", value: "REDEEMED" },
    { label: "Expired", value: "EXPIRED" }
  ];

  const fetchPromo = async () => {
    try {
      const res = await api.get("/promo");
      console.log("PROMO API:", res.data); // 👈 ADD THIS
  
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
      }
  
    } catch (err) {
      console.log(err);
      setData([]);
    }
  };
 
  useEffect(() => {
    fetchPromo();   // table
  }, []);
  
  useEffect(() => {
    fetchStats();   // stats (ONLY ON LOAD)
  }, []);
  const total = stats.total || 0;
const redeemed = stats.redeemed || 0;
const expired = stats.expired || 0;
const notRedeemed = stats.notRedeemed || 0;


useEffect(() => {
  setPage(1);
}, [search, status]);

const handleRefresh = async () => {
  setStatus("ALL");
  setSearch("");
  setPage(1);

  window.location.reload();

  await fetchPromo();
  await fetchStats(); 
};

const fetchStats = async () => {
  try {
    const res = await api.get("/promo/stats"); // 👈 route same rakho
    setStats(res.data);
  } catch (err) {
    console.error(err);
  }
};


const handleCardClick = (type) => {
  scrollToTable();

  if (type === "ALL") setStatus("ALL");
  if (type === "REDEEMED") setStatus("REDEEMED");
  if (type === "EXPIRED") setStatus("EXPIRED");
  if (type === "NOT_REDEEMED") setStatus("NOT_REDEEMED"); // custom logic below

  setPage(1);
};

  return (
    <div className="space-y-10">

      {/* ================= FILTER BAR (REFERENCE SAME) ================= */}
      <div className="
bg-[#B5B9B2]
rounded-4xl
px-6
py-4
flex
items-center
gap-2
flex-wrap
">

  {/* LEFT SIDE */}
  <div className="flex items-center gap-2 flex-wrap">

    {/* SEARCH (FIXED SAME AS OTHERS) */}
    <input
      placeholder="Search by Email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
        bg-white
        rounded-full
        px-5
        py-3
        w-[260px]
        outline-none
        text-[#002c3e]
        shrink-0
      "
    />

    {/* STATUS DROPDOWN (FIXED SIZE LIKE EXPORT) */}
    <div className="relative shrink-0">

    <button
  onClick={() => setOpenStatus(!openStatus)}
  className={`
    px-5
    py-3
    rounded-full
    font-semibold
    inline-flex
    items-center
    justify-between
    gap-2
    min-w-[150px]

    ${
      status !== "ALL"
        ? "bg-[#002c3e] text-white"   /* ✅ SELECTED = DARK */
        : "bg-[#002c3e] text-white"   /* ✅ ALL bhi DARK */
    }
  `}
>
  {statusOptions.find(s => s.value === status)?.label}

  <svg
    className={`w-6 h-6 transition ${openStatus ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M7 10l5 5 5-5" strokeWidth="2"/>
  </svg>
</button>

      {openStatus && (
        <div className="
          absolute
          top-13
          left-0
          w-full
          bg-[#7f837f]
          text-white
          rounded-xl
          overflow-hidden
          z-50
        ">
          {statusOptions.map((s) => (
            <div
              key={s.value}
              onClick={() => {
                setStatus(s.value);
                setOpenStatus(false);
              }}
              className="
                px-5
                py-2
                text-left
                hover:bg-[#6f736f]
                cursor-pointer
              "
            >
              {s.label}
            </div>
          ))}
        </div>
      )}

    </div>

    {/* REFRESH (MATCH SIZE) */}
    <button
      onClick={handleRefresh}
      className="
        bg-white
        w-10
        h-10
        rounded-full
        flex
        items-center
        justify-center
        shrink-0
      "
    >
      <img src="/refreshicon.svg" className="w-10 h-10"/>
    </button>

  </div>

  {/* RIGHT SIDE BUTTON */}
  <button
    onClick={() => setShowModal(true)}
    className="
      bg-[#002c3e]
      text-white
      px-5
      py-3
      rounded-full
      font-semibold
      shrink-0
      ml-auto   /* ✅ push right */
    "
  >
    Create Promo Code
  </button>

</div>

      {/* ================= STATS (REFERENCE CARD) ================= */}
      <div className="grid grid-cols-4 gap-6">

      <Card 
  label="Total Codes Sent" 
  value={total} 
  onClick={() => handleCardClick("ALL")} 
/>

<Card 
  label="Not Redeemed" 
  value={notRedeemed} 
  onClick={() => handleCardClick("NOT_REDEEMED")} 
/>

<Card 
  label="Redeemed" 
  value={redeemed} 
  onClick={() => handleCardClick("REDEEMED")} 
/>

<Card 
  label="Expired" 
  value={expired} 
  onClick={() => handleCardClick("EXPIRED")} 
/>

      </div>

      {/* ================= TABLE (REFERENCE EXACT) ================= */}
      <div 
  ref={tableRef}
  className="bg-white rounded-4xl border border-[#e6e6e6] overflow-hidden"
>
  {/* SCROLL CONTAINER */}
  <div className="max-h-[400px] overflow-y-auto">

  <table className="w-full text-[15px] tracking-wide">

      {/* STICKY HEADER */}
      <thead className="bg-[#78bcc4]  text-white sticky top-0 z-10">
        <tr>
        <th className="px-6 py-5 text-left w-[140px]">Code</th>
<th className="py-5 text-left w-[160px]">Access Duration</th>
<th className="px-8 py-5 text-left w-[280px]">Sent To</th>
<th className="px-6 py-5 text-left w-[160px]">Date Sent</th>
<th className="px-6 py-5 text-left w-[160px]">Status</th>
<th className="px-6 py-5 text-left w-[160px]">Code Expires</th>
        </tr>
      </thead>

      <tbody className="text-[#5a6c7d]">
  {filteredData.length === 0 ? (
    <tr className="h-[160px]">
      <td colSpan="6">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-lg font-semibold">
            No promo code records found
          </p>
          <p className="text-sm text-[#a0a0a0] -mt-2">
            Adjust your filters or search
          </p>
        </div>
      </td>
    </tr>
  ) : (
    
    paginatedData.map((row, i) => (
      <tr
      key={i}
      className="border-b border-[#e5e5e5] text-sm hover:bg-[#f7f8f3]"
    >
        <td className="px-6 py-4 font-medium">
          {row.code}
        </td>

        <td className="px-6 py-4 ">
          {row.duration}
        </td>

        <td className="px-6 py-4 break-all">
        {row.emails?.join(", ")}
</td>

        <td className="px-6 py-4">
        {new Date(row.createdAt).toLocaleDateString()}
        </td>

        {/* STATUS WITH COLOR */}
        <td
          className={"px-6 py-4 "}
        >
          {row.status}
        </td>

        <td className="px-6 py-4">
        {row.expiresAt
    ? new Date(row.expiresAt).toLocaleDateString()
    : "-"}
        </td>
      </tr>
    ))
  )}
</tbody>

    </table>

  </div>
</div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center items-center gap-6 mt-6">

<button
  disabled={safePage === 1}
  onClick={() => setPage(p => Math.max(p - 1, 1))}
  className="px-6 py-2 rounded-full border text-[#5a6c7d] border-[#5a6c7d] disabled:opacity-40"
>
  Back
</button>

<span className="text-[#5a6c7d] font-medium">
  Page {safePage} of {safeTotalPages}
</span>

<button
  disabled={safePage === safeTotalPages}
  onClick={() => setPage(p => Math.min(p + 1, safeTotalPages))}
  className="px-6 py-2 rounded-full bg-[#002c3e] text-white disabled:opacity-40"
>
  Next
</button>

</div>

      {/* ================= MODAL ================= */}
      {showModal && (
       <CreatePromoModal
       onClose={() => setShowModal(false)}
       refresh={fetchPromo}
     />
      )}

    </div>
  );
}


/* ================= SAME CARD COMPONENT ================= */

function Card({ label, value, onClick }) {
  return (
    <div
      onClick={onClick}   // ✅ THIS WAS MISSING
      className="
        bg-[#f5f5f5] 
        rounded-4xl 
        px-8 py-4 
        cursor-pointer   /* 👈 important */
        transition-all duration-200
        hover:scale-[1.03] hover:shadow-md
      "
    >
      <p className="text-[#5a6c7d] mt-1 text-[16px] font-semibold">
        {label}
      </p>

      <p className="text-[48px] font-semibold mt-2 text-[#002c3e]">
        {value}
      </p>
    </div>
  );
}