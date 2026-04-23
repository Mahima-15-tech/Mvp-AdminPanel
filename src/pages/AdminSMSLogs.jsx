import { useEffect, useState , useRef } from "react";
import api from "../api/axios";
// import CustomDatePicker from "../components/CustomDatePicker";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function InlineDatePicker({ value, onChange, label }) {

  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);

  const [appleCommission, setAppleCommission] = useState(15);
const [googleCommission, setGoogleCommission] = useState(20);


  const ref = useRef();

  const years = Array.from({ length: 50 }, (_, i) => 2000 + i);
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setShowMonth(false);
        setShowYear(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>

      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center bg-white rounded-full overflow-hidden cursor-pointer hover:shadow-md transition"
      >

        {/* LABEL */}
        <span className="px-4 py-3.5 text-white bg-[#78bcc4] font-semibold text-sm">
          {label}
        </span>

        {/* DATE */}
        <div className="px-4 py-2 flex items-center gap-1 text-[#5a6c7d] text-sm min-w-[140px]">

          {value
            ? new Date(value).toLocaleDateString("en-GB").replaceAll("/", " | ")
            : "DD | MM | YY"
          }

          <CalendarDays size={16} className="text-[#002c3e] ml-auto" />

        </div>

      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute top-[55px] left-0 z-50 bg-white rounded-2xl p-4 w-[280px] shadow-[0_10px_30px_rgba(0,0,0,0.15)]">

          <DatePicker
            selected={tempDate}
            onChange={(date) => setTempDate(date)}
            inline

            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
            }) => (

              <div className="flex items-center justify-between mb-3">

                {/* LEFT */}
                <button
                  onClick={decreaseMonth}
                  className="w-8 h-8 rounded-full bg-[#f1f3f4] hover:bg-[#e5e7eb]"
                >
                  ←
                </button>

                {/* CENTER */}
                <div className="flex gap-2 relative">

                  {/* MONTH */}
                  <div className="relative">
                    <div
                      onClick={() => {
                        setShowMonth(!showMonth);
                        setShowYear(false);
                      }}
                      className="bg-[#f5f5f5] px-3 py-1 rounded-full text-sm font-semibold cursor-pointer"
                    >
                      {months[date.getMonth()]}
                    </div>

                    {showMonth && (
                      <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl max-h-40 overflow-y-auto z-50">
                        {months.map((m, i) => (
                          <div
                            key={m}
                            onClick={() => {
                              changeMonth(i);
                              setShowMonth(false);
                            }}
                            className="px-4 py-2 hover:bg-[#0cb4ab]/10 cursor-pointer"
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* YEAR */}
                  <div className="relative">
                    <div
                      onClick={() => {
                        setShowYear(!showYear);
                        setShowMonth(false);
                      }}
                      className="bg-[#f5f5f5] px-3 py-1 rounded-full text-sm font-semibold cursor-pointer"
                    >
                      {date.getFullYear()}
                    </div>

                    {showYear && (
                      <div className="absolute top-10 left-0 bg-white shadow-lg rounded-xl max-h-40 overflow-y-auto z-50">
                        {years.map((y) => (
                          <div
                            key={y}
                            onClick={() => {
                              changeYear(y);
                              setShowYear(false);
                            }}
                            className={`px-4 py-2 cursor-pointer ${
                              y === date.getFullYear()
                                ? "bg-[#0cb4ab] text-white"
                                : "hover:bg-[#0cb4ab]/10"
                            }`}
                          >
                            {y}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* RIGHT */}
                <button
                  onClick={increaseMonth}
                  className="w-8 h-8 rounded-full bg-[#f1f3f4] hover:bg-[#e5e7eb]"
                >
                  →
                </button>

              </div>
            )}
          />

          {/* FOOTER */}
          <div className="flex justify-between mt-4">

            <button
              onClick={() => {
                setTempDate(null);
                setOpen(false);
              }}
              className="bg-[#B5B9B2] text-white px-5 py-2 rounded-full text-sm"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onChange(tempDate);
                setOpen(false);
              }}
              className="bg-[#002c3e] text-white px-5 py-2 rounded-full text-sm"
            >
              Confirm
            </button>

          </div>

        </div>
      )}

    </div>
  );
}



export default function AdminRevenue() {

const [data,setData] = useState([]);

const [month,setMonth] = useState("THIS_MONTH");
const [openMonth,setOpenMonth] = useState(false);

const [from,setFrom] = useState("");
const [to,setTo] = useState("");

const [openExport,setOpenExport] = useState(false);

const [page,setPage] = useState(1);
const perPage = 4;

const totalPages = Math.ceil(data.length / perPage);

const paginatedData = data.slice(
(page-1)*perPage,
page*perPage
);

const [highlightTable, setHighlightTable] = useState(false);
const [highlightSummary, setHighlightSummary] = useState(false);

const [commission, setCommission] = useState(15);

const [appleCommission, setAppleCommission] = useState(15);
const [googleCommission, setGoogleCommission] = useState(20);

const [showFullGross, setShowFullGross] = useState(false);
const [showFullNet, setShowFullNet] = useState(false);

const grossValue = 888899000.00;
const netValue = 6808.80;


const titleMonth = () => {

  const now = new Date();

  if (month === "CUSTOM" && from && to) {
    return `${new Date(from).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })} - ${new Date(to).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })}`;
  }

  if (month === "THIS_MONTH") {
    return new Date(now.getFullYear(), now.getMonth(), 1)
      .toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  if (month === "LAST_MONTH") {
    return new Date(now.getFullYear(), now.getMonth() - 1, 1)
      .toLocaleDateString("en-GB", { month: "short", year: "numeric" });
  }

  if (month === "LAST_3") return "Last 3 Months";
  if (month === "YTD") return "Year to Date";

  return "All Time";
};

const exportCSV = ()=>{

    let csv = "Date,UserID,UserName,Plan,Gross,Net\n";
    
    data.forEach(r=>{
    csv += `${r.date},${r.userId},${r.userName},${r.plan},${r.gross},${r.net}\n`;
    });
    
    const blob = new Blob([csv]);
    
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    
    a.href = url;
    a.download = "revenue.csv";
    
    a.click();
    
    };


    const exportPDF = ()=>{

        const doc = new jsPDF();
        
        const rows = data.map(r=>[
        new Date(r.date).toLocaleDateString(),
        r.userId,
        r.userName,
        r.plan,
        r.gross,
        r.net
        ]);
        
        autoTable(doc,{
        head:[["Date","UserID","UserName","Plan","Gross","Net"]],
        body:rows
        });
        
        doc.save("revenue.pdf");
        
        };

/* ================= DUMMY DATA ================= */

const fetchRevenue = async()=>{
    const res = await api.get("/admin/revenue",{
    params:{
    month,
    from: from ? new Date(from).toISOString().split("T")[0] : "",
    to: to ? new Date(to).toISOString().split("T")[0] : ""
    }
    });
    
    setData(res.data);
    };

    useEffect(()=>{
        fetchRevenue();
        },[month]);


/* ================= TOTAL ================= */

const grossTotal = data.reduce((a,b)=>a+b.gross,0);
const netTotal = data.reduce((a,b)=>a+b.net,0);


const scrollToTable = () => {
  const el = document.getElementById("revenue-table");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    setHighlightTable(true);
    setTimeout(() => setHighlightTable(false), 2000);
  }
};

const scrollToSummary = () => {
  const el = document.getElementById("revenue-summary");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    setHighlightSummary(true);
    setTimeout(() => setHighlightSummary(false), 2000);
  }
};



const AutoFitText = ({ text }) => {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let size = 20; // starting size

    // reduce font until it fits
    while (el.scrollWidth > el.offsetWidth && size > 10) {
      size -= 1;
      el.style.fontSize = size + "px";
    }

    setFontSize(size);
  }, [text]);

  return (
    <span
      ref={ref}
      className="font-semibold whitespace-nowrap text-right block"
      style={{ fontSize }}
    >
      {text}
    </span>
  );
};


/* ================= MONTH OPTIONS ================= */

const months = [
    {label:"All",value:"ALL"},
    {label:"This Month",value:"THIS_MONTH"},
    {label:"Last Month",value:"LAST_MONTH"},
    {label:"Last 3 Months",value:"LAST_3"},
    {label:"Year to Date",value:"YTD"}
    ];

    const formatCompact = (num) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(num);


  

  

return(

<div className="space-y-10">


{/* ================= FILTER BAR ================= */}
<div className="bg-[#B5B9B2] rounded-4xl px-6   py-5 flex items-center gap-3 flex-wrap">
{/* MONTH */}

<div className="relative">

<button
  onClick={() => setOpenMonth(!openMonth)}
  className="
  bg-[#002c3e]
  text-white
  px-10
  py-3
  rounded-full
  inline-flex
  items-center
  gap-2
  tracking-wide
  font-semibold
  whitespace-nowrap
  "
>
  {months.find(m => m.value === month)?.label}

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition ${openMonth ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 10l5 5 5-5"
    />
  </svg>
</button>

{openMonth && (

<div className="absolute top-13  bg-[#7f837f] text-white rounded-xl overflow-hidden">

{months.map(m=>(

<div
key={m.value}
onClick={()=>{
setMonth(m.value);
setOpenMonth(false);
}}
className="px-6 py-2 leading-4 hover:bg-[#6f736f] cursor-pointer"
>

{m.label}

</div>

))}

</div>

)}

</div>


{/* EXPORT */}

<div className="relative">

<button
  onClick={() => setOpenExport(!openExport)}
  className="bg-[#f5f5f5] rounded-full px-9 py-3 font-semibold text-[#5a6c7d] inline-flex items-center gap-2"
>
  Export

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 transition ${openExport ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 10l5 5 5-5"
    />
  </svg>
</button>

{openExport && (

<div className="absolute top-13 left-4 bg-[#7f837f] shadow-lg rounded-xl overflow-hidden z-50">

<div
onClick={()=>{
exportCSV();
setOpenExport(false);
}}
className="px-8 py-2 hover:bg-gray-800 cursor-pointer"
>
CSV
</div>

<div
onClick={()=>{
exportPDF();
setOpenExport(false);
}}
className="px-8 py-2 hover:bg-gray-800 cursor-pointer"
>
PDF
</div>

</div>

)}

</div>


{/* REFRESH */}

<button
onClick={()=>{
setFrom("");
setTo("");
setMonth("ALL");
fetchRevenue();
}}
className="bg-white w-10 h-10 rounded-full flex items-center justify-center shrink- "
>
<img src="/refreshicon.svg" className="w-10 h-10"/>
</button>


<InlineDatePicker
value={from}
onChange={setFrom}
label="From"
/>

<InlineDatePicker
value={to}
onChange={setTo}
label="To"
/>
  


<button
onClick={()=>{
    setMonth("CUSTOM");
    setPage(1);
    
    setTimeout(()=>{
      fetchRevenue();
    },0);
    }}
className="bg-[#002c3e] text-white px-10 font-semibold py-3 rounded-full"
>
Apply
</button>

</div>


{/* ================= STATS ================= */}

<div className="grid grid-cols-3 gap-6">

<Card 
  label="Total Transactions" 
  value={data.length} 
  onClick={scrollToTable}
/>

<Card 
  label="Gross Revenue" 
  value={`$${grossTotal.toFixed(2)}`} 
/>

<Card 
  label="Net Revenue" 
  value={`$${netTotal.toFixed(2)}`} 
  />

</div>





{/* ================= TABLE ================= */}

<div 
  id="revenue-table"
  className={`bg-white rounded-4xl overflow-hidden border border-[#e6e6e6] transition-all duration-500 ${
    highlightTable ? "ring-4 ring-[#78bcc4]" : ""
  }`}
>

<table className="w-full text-[16px] tracking-wide table-fixed">

    {/* HEADER (unchanged) */}
    <thead className="bg-[#78bcc4] text-white">
  <tr>
    <th className="w-[16%] px-6 py-5 text-left">Date</th>
    <th className="w-[16%] px-6 py-5 text-left">User ID</th>
    <th className="w-[18%] px-6 py-5 text-left">User Name</th>
    <th className="w-[14%] px-6 py-5 text-left">Plan</th>
    <th className="w-[18%] px-6 py-5 text-left">Gross</th>
    <th className="w-[18%] px-6 py-5 text-left">Net</th>
  </tr>
</thead>

    <tbody className="text-[#5a6c7d]">

      {/* ✅ EMPTY STATE (ONLY CHANGE) */}
      {data.length === 0 ? (

<tr className="h-[160px]">

  <td colSpan="6" className="px-6">
    <div className="flex flex-col items-center justify-center h-full text-center gap-2">
      
      <p className="text-lg font-semibold text-[#5a6c7d]">
        No revenue data found
      </p>

      <p className="text-sm -mt-2.5 text-[#a0a0a0]">
        Try adjusting filters or date range
      </p>

    </div>
  </td>

</tr>

) : (

        /* DATA SAME AS YOURS */
        paginatedData.map((r,i)=>(

          <tr
            key={i}
            className="border-b border-[#e5e5e5] hover:bg-[#f7f8f3]"
          >

            <td className="px-6 py-4">
              {new Date(r.date).toLocaleDateString("en-GB",{
                day:"2-digit",
                month:"short",
                year:"numeric"
              })}
            </td>

            <td className="px-6 py-4">
              {r.userId}
            </td>

            <td className="px-6 py-4 font-semibold">
              {r.userName}
            </td>

            <td className="px-6 py-4">
              {r.plan?.toLowerCase()}
            </td>

            <td className="px-6 py-4 text-[#78bcc4] font-semibold">
              ${r.gross.toFixed(2)}
            </td>

            <td className="px-6 py-4 text-[#78bcc4] font-semibold">
              ${r.net.toFixed(2)}
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>

<div className="flex justify-center items-center gap-6 mt-6">

<button
onClick={()=>setPage(p=>Math.max(p-1,1))}
className="border border-[#5a6c7d] px-6 py-2 rounded-full text-[#5a6c7d]"
>
Back
</button>

<span className="text-[#5a6c7d] font-medium">
Page {page} of {totalPages}
</span>

<button
onClick={()=>setPage(p=>Math.min(p+1,totalPages))}
className="bg-[#002c3e] text-white px-6 py-2 rounded-full"
>
Next
</button>

</div>

{/* ================= REVENUE SUMMARY ================= */}

<div className="w-full  rounded-xl px- py-5 flex flex-col gap-4">

  {/* ================= TOP ================= */}
  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

    {/* ================= LEFT ================= */}
    <div className="flex flex-col gap-3">

      {/* TITLE + DATE */}
      <div className="flex items-center gap-3">
        <p className="text-2xl  font-semibold text-[#002c3e]">
          Revenue
        </p>

        <p className="text-sm text-[#5a6c7d] mt-1.5 font-medium whitespace-nowrap">
          {titleMonth()}
        </p>
      </div>

      {/* GROSS + NET */}
      <div className="flex gap-3 flex-wrap">
      <div className="flex gap-3">
      <div className="flex gap-3">

{/* GROSS */}
<div className="flex gap-3 flex-nowrap">

  {/* GROSS */}
  <div className="flex gap-3">

{/* GROSS */}
<div className="bg-white px-3 py-2 rounded-full flex items-center justify-between">
  
  <span className="text-[#5a6c7d] font-semibold whitespace-nowrap">
    Gross
  </span>

  <span className="text-[#002c3e] ml-2 font-semibold whitespace-nowrap">
  ${grossTotal?.toFixed(2) || "0.00"}
  </span>

</div>

{/* NET */}
<div className="bg-white px-4 py-2 rounded-full flex items-center justify-between">
  
  <span className="text-[#5a6c7d] font-semibold whitespace-nowrap">
    Net
  </span>

  <span className="text-[#002c3e] ml-2 font-semibold whitespace-nowrap">
  ${netTotal?.toFixed(2) || "0.00"} 
  </span>

</div>


</div>
</div>

</div>
</div>
      </div>
    </div>

    {/* ================= RIGHT ================= */}
    <div className="flex flex-col gap-3 w-full lg:w-auto">

      {/* COMMISSION TITLE + LINE */}
      <div className="flex items-center  gap-4">
        <p className="text-2xl font-semibold mt-0.5 text-[#002c3e]">
          Commission
        </p>

        <p className="text-sm mt-1.5  text-[#5a6c7d] whitespace-nowrap">
          Edit app store rates
        </p>
      </div>

      {/* PILLS + SAVE */}
      <div className="flex items-center  gap-3 flex-wrap lg:flex-nowrap">

        {/* APPLE */}
        <div className="bg-white px-4 py-2  rounded-full flex items-center gap-2 whitespace-nowrap">
          <span className="text-[#5a6c7d] font-semibold">
            Apple App Store
          </span>

          <div className="flex items-center -ml-2 ">

{/* NUMBER BOX (FIXED WIDTH) */}
<span className="text-[#002c3e] font-semibold w-[32px] text-right tabular-nums">
  {appleCommission}
</span>

{/* % FIXED */}
<span className="text-[#002c3e] font-semibold">
  %
</span>

</div>

          <div className="flex gap-1 text-xs text-black">
            <button className="hover:bg-[#e3e9ef]" onClick={() => setAppleCommission(p => p + 1)}>▲</button>
            <button  className="hover:bg-[#e3e9ef]" onClick={() => setAppleCommission(p => Math.max(0, p - 1))}>▼</button>
          </div>
        </div>

        {/* GOOGLE */}
        <div className="bg-white px-4 py-2 -mt-1 rounded-full flex items-center gap-2 whitespace-nowrap">
          <span className="text-[#5a6c7d] font-semibold">
            Google Play Store
          </span>

          <div className="flex items-center -ml-2">

<span className="text-[#002c3e] font-semibold w-[32px] text-right tabular-nums">
  {googleCommission}
</span>

<span className="text-[#002c3e] font-semibold">
  %
</span>

</div>

          <div className="flex gap-1 text-xs text-black ">
            <button className="hover:bg-[#e3e9ef] " onClick={() => setGoogleCommission(p => p + 1)}>▲</button>
            <button className="hover:bg-[#e3e9ef]" onClick={() => setGoogleCommission(p => Math.max(0, p - 1))}>▼</button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={async () => {
            await api.post("/admin/set-commission", {
              apple: appleCommission,
              google: googleCommission
            });
            fetchRevenue();
          }}
          className="bg-[#002c3e] text-white px-6 py-2  -mt-1 rounded-full font-semibold whitespace-nowrap"
        >
          Save
        </button>

      </div>
    </div>

  </div>

 

</div>


</div>

);
}



/* ================= CARD ================= */

function Card({ label, value, error, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
      bg-[#f5f5f5] rounded-4xl px-8 py-6
      ${onClick ? "cursor-pointer hover:scale-[1.03] hover:shadow-md" : ""}
      transition-all duration-200
      `}
    >
      <p className="text-[#5a6c7d] text-[16px] font-semibold">
        {label}
      </p>

      <p className={`text-[48px] font-semibold mt-2 ${
        error ? "text-[#ee6a59]" : "text-[#002c3e]"
      }`}>
        {value}
      </p>
    </div>
  );
}