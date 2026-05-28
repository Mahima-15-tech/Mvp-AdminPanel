import { useState } from "react";
import CreatePromoModal from "../components/CreatePromoModal";
import api from "../api/axios";
import { useEffect } from "react";

export default function PromoCodes() {

  const [showModal, setShowModal] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

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

    if (status === "1M") return d.duration === "1 Month";
    if (status === "1Y") return d.duration === "1 Year";
    if (status === "UNLIMITED") return d.duration === "Unlimited";

    return true;
  });

  // 📄 PAGINATION
  const totalPages = Math.ceil(filteredData.length / perPage);
  
  const paginatedData = filteredData.slice(
    (page - 1) * perPage,
    page * perPage
  );

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
    fetchPromo();
  }, []);

  const total = data.length;

const expired = data.filter(d => d.status === "Expired").length;

const redeemed = data.filter(d => d.status === "Redeemed").length;

const notRedeemed = total - redeemed - expired;


useEffect(() => {
  setPage(1);
}, [search, status]);


  return (
    <div className="space-y-10">

      {/* ================= FILTER BAR (REFERENCE SAME) ================= */}
      <div className="bg-[#B5B9B2] rounded-4xl px-6 py-5 flex items-center gap-3 flex-wrap justify-between">

        <div className="flex items-center gap-3 flex-wrap">

          {/* SEARCH */}
          <div className="bg-white px-4 py-3 rounded-full flex items-center gap-2 w-[260px]">
          <input
  placeholder="Search by Email..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="outline-none text-sm w-full text-[#5a6c7d] font-semibold tracking-wide"
/>
          </div>

          {/* STATUS DROPDOWN (REFERENCE STYLE) */}
          <div className="relative">

            <button
              onClick={() => setOpenStatus(!openStatus)}
              className="bg-[#002c3e] text-white px-8 py-3 rounded-full flex items-center gap-2 font-semibold"
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
              <div className="absolute top-14 bg-[#7f837f] text-white rounded-xl overflow-hidden z-50">

                {statusOptions.map((s) => (
                  <div
                    key={s.value}
                    onClick={() => {
                      setStatus(s.value);
                      setOpenStatus(false);
                    }}
                    className="px-10 py-1 hover:bg-[#6f736f] cursor-pointer text-left"
                  >
                    {s.label}
                  </div>
                ))}

              </div>
            )}

          </div>

          {/* REFRESH */}
          <button
  onClick={fetchPromo}
  className="bg-white w-10 h-10 rounded-full flex items-center justify-center"
>
            <img src="/refreshicon.svg" className="w-12 h-12"/>
          </button>

        </div>

        {/* CREATE BUTTON */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#002c3e] text-white px-8 py-3 rounded-full font-semibold"
        >
          Create Promo Code
        </button>

      </div>

      {/* ================= STATS (REFERENCE CARD) ================= */}
      <div className="grid grid-cols-4 gap-6">

      <Card label="Total Codes Sent" value={total} />
<Card label="Not Redeemed" value={notRedeemed} />
<Card label="Redeemed" value={redeemed} />
<Card label="Expired" value={expired} />

      </div>

      {/* ================= TABLE (REFERENCE EXACT) ================= */}
      <div className="bg-white rounded-4xl border border-[#e6e6e6] overflow-hidden">

  {/* SCROLL CONTAINER */}
  <div className="max-h-[400px] overflow-y-auto">

  <table className="w-full text-[16px] tracking-wide">

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
        <td className="px-6 py-4 font-semibold">
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
      <div className="flex justify-center items-center gap-6">

        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          className="border border-[#5a6c7d] px-6 py-2 rounded-full text-[#5a6c7d]"
        >
          Back
        </button>

        <span className="text-[#5a6c7d] font-medium">
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          className="bg-[#002c3e] text-white px-6 py-2 rounded-full"
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

function Card({ label, value }) {
  return (
    <div className="bg-[#f5f5f5] rounded-4xl px-8 py-4 ">

      <p className="text-[#5a6c7d] mt-1 text-[16px] font-semibold">
        {label}
      </p>

      <p className="text-[48px] font-semibold mt-2 text-[#002c3e]">
        {value}
      </p>

    </div>
  );
}