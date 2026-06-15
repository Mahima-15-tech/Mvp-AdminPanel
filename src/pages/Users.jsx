import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { TbRefresh } from "react-icons/tb";
import CustomDatePicker from "../components/CustomDatePicker";
import EmptyState from "../components/EmptyState";
import { useLocation } from "react-router-dom";
import InlineDatePicker from "../components/InlineDatePicker";

export default function Users() {

const [users,setUsers]=useState([])
const [page,setPage]=useState(1)
const [loading,setLoading]=useState(true)
const [search,setSearch]=useState("")
const [fromDate,setFromDate]=useState("")
const [toDate,setToDate]=useState("")
const [stats,setStats]=useState({})
const [regions,setRegions]=useState({})
const [countries,setCountries]=useState([])
const [totalPages,setTotalPages]=useState(1)
const [rowsPerPage,setRowsPerPage]=useState(5)
const [searchInput,setSearchInput] = useState("")
// const [highlight, setHighlight] = useState(false);
const [activeFilter, setActiveFilter] = useState(null);
const location = useLocation();

const [filterType, setFilterType] = useState("ALL");

const [confirmUser,setConfirmUser]=useState(null)

const [openExport, setOpenExport] = useState(false);
const exportRef = useRef();



const tableRef = useRef(null);



useEffect(() => {
  const params = new URLSearchParams(location.search);

  const filter = params.get("filter") || "ALL";
  const limit = 5; 

  // state set
  setFilterType(filter);
  setRowsPerPage(5);
  setPage(1);

  // 🔥 DIRECT API CALL (important)
  fetchUsersDirect(filter);

  // scroll
  if (location.hash === "#users-table") {
    setTimeout(() => {
      const el = document.getElementById("users-table");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

}, [location]);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (exportRef.current && !exportRef.current.contains(e.target)) {
      setOpenExport(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

const scrollToUsersTable = () => {
  const el = document.getElementById("users-table");

  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });

    // highlight on
    setHighlight(true);

    // remove highlight after 2 sec
    setTimeout(() => {
      setHighlight(false);
    }, 2000);
  }
};


const handleCardClick = (type) => {
  setFilterType(type);
  setPage(1); 

  const el = document.getElementById("users-table");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }



  // remove highlight after 3 sec
  setTimeout(() => {
    setActiveFilter(null);
  }, 3000);
};


const handleRefresh = () => {
  setFromDate("");
  setToDate("");
  setSearchInput("");
  setSearch("");
  setPage(1);
  setFilterType("ALL"); 

  fetchUsers(); 
};

const formatPlan = (plan) => {
  if (!plan) return "-";

  return plan
    .toLowerCase()                // monthly
    .split(" ")                   // ["no","plan"]
    .map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    )                             // ["No","Plan"]
    .join(" ");                   // "No Plan"
};


const navigate=useNavigate()

useEffect(() => {
  console.log("USERS DATA 👉", users);
}, [users]);

useEffect(()=>{
  fetchUsers()
},[page, rowsPerPage, search, fromDate, toDate, filterType])


const firstLoad = useRef(true);

const fetchUsersDirect = async (filter, limit) => {
  try {
    setLoading(true);

    const res = await api.get("/admin/users/dashboard-ultra", {
      params: {
        page: 1,
        limit: 5,
        search,
        from: fromDate,
        to: toDate,
        filter: filter
      }
    });

    setUsers(res.data.users.data);
    setTotalPages(res.data.users.pages || 1);
    setStats(res.data.stats);
    setRegions(res.data.regions);
    setCountries(res.data.countries);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};




const fetchUsers=async()=>{

try{

setLoading(true)

const res=await api.get("/admin/users/dashboard-ultra",{
  
params:{
page,
limit:rowsPerPage,
search,
from:fromDate,
to:toDate,
filter: filterType 
}
})
console.log("FULL RESPONSE 👉", res);
console.log("DATA 👉", res.data);
console.log("USERS 👉", res.data?.users?.data);
const pages = res.data.users.pages;

setUsers(res.data.users.data)
setTotalPages(res.data.users.pages || 1);

setStats(res.data.stats)
setRegions(res.data.regions)
setCountries(res.data.countries)

}
catch(err){
console.error(err)
}
finally{
setLoading(false)
}

}



useEffect(() => {
  if (users.length === 0) {
    setPage(1);
  }
}, [users]);

const toggleBan = async (user) => {

try{

if(user.status==="ACTIVE"){

await api.patch(`/admin/users/${user._id}/ban`,{
reason:"Admin action"
})

}else{

await api.patch(`/admin/users/${user._id}/unban`)

}

fetchUsers()

setConfirmUser(null)

}catch(err){

console.error(err)

}

}

const formatDate=(date)=>{
if(!date) return "-"
const d=new Date(date)
const day=String(d.getDate()).padStart(2,"0")
const month=String(d.getMonth()+1).padStart(2,"0")
const year=String(d.getFullYear()).slice(-2)
return `${day}/${month}/${year}`
}



const handleExport = async (type) => {

  try{
  
  const url =
  type === "csv"
  ? "/admin/users/export-csv"
  : "/admin/users/export-full"
  
  const res = await api.get(
  url,
  {
  params:{
  from:fromDate,
  to:toDate
  },
  responseType:"blob"
  }
  )
  
  const blob = new Blob([res.data])
  const link = document.createElement("a")
  
  link.href = window.URL.createObjectURL(blob)
  link.download = `users.${type}`
  
  document.body.appendChild(link)
  link.click()
  
  }catch(err){
  
  console.error(err)
  
  }
  
  }

  const formatName = (name) => {
    if (!name) return "Unnamed";
  
    const parts = name.trim().split(" ");
  
    if (parts.length === 1) return parts[0];
  
    return parts[0] + "..."; 
  };

  const safeTotalPages = totalPages > 0 ? totalPages : 1;
const safePage = Math.min(page, safeTotalPages);




return(

<div className="space-y-8">

{/* TOOLBAR */}

<div className="bg-[#B5B9B2] rounded-4xl px-6 py-4 flex items-center gap-2">

  {/* SEARCH (STANDARD SIZE) */}
  <input
    type="text"
    placeholder="Search Users..."
    value={searchInput}
    onChange={(e)=>setSearchInput(e.target.value)}
    className="
      bg-white
      rounded-full
      py-3
      px-5
      w-[260px]   /* ✅ STANDARD SIZE */
      outline-none
      text-[#002c3e]
      shrink-0
    "
  />

  {/* REFRESH (MATCH HEIGHT) */}
  <button
    onClick={handleRefresh}
    className="
      bg-white
      h-10 w-10
      rounded-full
      flex items-center justify-center
      shrink-0
    "
  >
    <img src="/refreshicon.svg" className="w-10 h-10"/>
  </button>

  {/* DATE PICKERS */}
  <div className="flex items-center gap-2 shrink-0">
    <InlineDatePicker
      value={fromDate}
      onChange={setFromDate}
      label="From"
    />

    <InlineDatePicker
      value={toDate}
      onChange={setToDate}
      label="To"
    />
  </div>

  {/* APPLY (STANDARD BUTTON) */}
  <button
    onClick={()=>{
      setPage(1)
      fetchUsers()
    }}
    className="
      bg-[#002c3e]
      text-white
      py-3
      px-5
      rounded-full
      font-semibold
      shrink-0
    "
  >
    Apply
  </button>

  {/* EXPORT (SAME AS APPLY) */}
  <div className="relative shrink-0" ref={exportRef}>
    
    <button
      onClick={() => setOpenExport(!openExport)}
      className="
        bg-[#002c3e]
        text-white
        py-3
        px-5
        rounded-full
        flex items-center gap-2
        font-semibold
      "
    >
      Export

      <svg
        className={`w-4 h-4 transition ${openExport ? "rotate-180" : ""}`}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </button>

    {openExport && (
      <div className="absolute right-0 mt-2 w-28 bg-[#7f817d] rounded-xl shadow-lg p-2 z-50">

        <div
          onClick={() => {
            handleExport("csv");
            setOpenExport(false);
          }}
          className="px-3 py-1.5 rounded-md cursor-pointer text-[#f5f5f5] hover:bg-[#4c4e4a]"
        >
          CSV
        </div>

        <div
          onClick={() => {
            handleExport("pdf");
            setOpenExport(false);
          }}
          className="px-3 py-1.5 rounded-md cursor-pointer text-[#f5f5f5] hover:bg-[#4c4e4a]"
        >
          PDF
        </div>

      </div>
    )}
  </div>

</div>


{/* STATS ROW 1 */}

<div className="grid grid-cols-4 gap-6">
<StatCard title="Total Users" value={stats.totalUsers || 0} onClick={() => handleCardClick("ALL")} />

<StatCard title="Trial Users" value={stats.trialUsers || 0} onClick={() => handleCardClick("TRIAL")} />

<StatCard title="Active Subscribers" value={stats.activeSubscribers || 0} onClick={() => handleCardClick("ACTIVE")} />

<StatCard title="Expired / Cancelled" value={stats.expiredCancelled || 0} red onClick={() => handleCardClick("EXPIRED")} />
</div>


{/* STATS ROW 2 */}

<div className="grid grid-cols-4 gap-6">

<StatCard title="Banned Users" value={stats.bannedUsers || 0} red onClick={() => handleCardClick("BANNED")} />
<StatCard 
  title="Pending Verification" 
  value={stats.pendingVerification || 0}
  onClick={() => handleCardClick("PENDING_VERIFICATION")}
/>

<StatCard 
  title="No Contacts Added" 
  value={stats.noContacts || 0}
  onClick={() => handleCardClick("NO_CONTACTS")}
/>
<StatCard title="Credits Low (<2)" value={stats.lowCredits || 0} onClick={() => handleCardClick("LOW_CREDITS")} />

</div>


{/* ANALYTICS */}

<div className="grid grid-cols-2 gap-6">

<RegionCard regions={regions}/>
<CountriesCard countries={countries}/>

</div>


{/* USERS TABLE */}

<div 
ref={tableRef}
  id="users-table"
  className={`bg-white rounded-4xl w-full mx-auto overflow-hidden border border-[#e6e6e6] transition-all duration-500 
  }`}
>

  <table className="w-full text-[14px] font-light table-fixed">

    <thead className="bg-[#78bcc4] text-white">
      <tr>
        <th className="px-6 py-6 text-left">User ID</th>
        <th className="px-6 py-4 text-left leading-4">User Name</th>
        <th className="px-6 py-4 text-left">Joined</th>
        <th className="px-6 py-4 text-left">Plans</th>
        <th className="px-6 py-4 text-left">Renewal</th>
        <th className="px-6 py-4 text-left leading-4">Alert Credits</th>
        <th className="px-6 py-4 text-left leading-4">Check-Ins</th>
        <th className="px-6 py-4 text-left leading-4">Alerts Sent</th>
        <th className="px-6 py-4 text-left leading-4">Alerts Type</th>
        <th className="px-6 py-4 text-left">Status</th>
      </tr>
    </thead>




    <tbody className="text-[#5a6c7d]">

{loading ? (

  <tr>
    <td colSpan="10">
      <div className="p-10 text-center text-gray-400">
        Loading users...
      </div>
    </td>
  </tr>

) : users.length === 0 ? (

  <tr className="h-[160px]">
    <td colSpan="10" className="px-6">
      <div className="flex flex-col items-center justify-center h-full text-center gap-2">
        <p className="text-lg font-semibold text-[#5a6c7d]">
          No users found
        </p>
        <p className="text-sm -mt-2.5 text-[#a0a0a0]">
          Try adjusting filters or search
        </p>
      </div>
    </td>
  </tr>

) : (

  users.map((user) => {

    const isPending =
      !user.name ||
      !user.email ||
      user.name === "Unnamed" ||
      user.nameCompleted !== true ||
      user.emailCompleted !== true;

    return (
      <tr
        key={user._id}
        className={`
border-b border-[#e6e6e6] transition

${
  activeFilter === "PENDING_VERIFICATION"
    ? isPending
      ? "bg-[#fff7e6]"
      : "opacity-40"

  : activeFilter === "TRIAL" && user.plan === "TRIAL"
    ? "bg-[#e6f7ff]"

  : activeFilter === "BANNED" && user.status !== "ACTIVE"
    ? "bg-[#ffecec]"

  : activeFilter === "LOW_CREDITS" && user.alertCredits < 2
    ? "bg-[#fff7e6]"

  : activeFilter === "NO_CONTACTS" &&
    (user.contactsCount || 0) === 0
    ? "bg-[#ffecec]"

  : activeFilter
    ? "opacity-80"
    : ""
}

hover:bg-[#f7f8f3]
`}
      >

        <td className="px-3 py-4 font-medium whitespace-nowrap">
          {user.userId}
        </td>

        <td
          onClick={() => navigate(`/users/${user._id}`)}
          className="px-6 py-4 font-semibold cursor-pointer whitespace-nowrap"
        >
          {formatName(user.name)}
        </td>

        <td className="px-6 py-4">
          {formatDate(user.joined)}
        </td>

        <td className="px-6 py-4">
          {formatPlan(user.plan)}
        </td>

        <td className="px-6 py-4">
          {user.renewal ? formatDate(user.renewal) : "-"}
        </td>

        <td className="px-6 py-4">
          {user.alertCredits ?? 0}
        </td>

        <td className="px-6 py-4 break-words">
          {user.checkinTimes?.join(" | ") || "-"}
        </td>

        <td className="px-6 py-4">
          {user.alertsSent ?? 0}
        </td>

        <td className="px-6 py-4 font-semibold break-words">
          <span
            className={`${
              user.lastAlertType === "SOS" ||
              user.lastAlertType === "MISSED_CHECKIN"
                ? "text-[#ee6a59]"
                : ""
            }`}
          >
            {user.lastAlertType === "MISSED_CHECKIN"
              ? "Missed"
              : user.lastAlertType || "-"}
          </span>
        </td>

        <td
          onClick={() => setConfirmUser(user)}
          className={`px-6 py-4 font-semibold cursor-pointer ${
            user.status === "ACTIVE"
              ? "text-[#78bcc4]"
              : "text-[#ee6a59]"
          }`}
        >
          {user.status === "ACTIVE" ? "Active" : "Banned"}
        </td>

      </tr>
    );
  })

)}

</tbody>

  </table>

</div>

{/* PAGINATION */}

<div className="flex items-center justify-center gap-6 mt-10">

<button
disabled={safePage === 1}
onClick={() => {
  setPage(p => Math.max(p - 1, 1));
}}
className="px-6 py-2 rounded-full border text-[#5a6c7d] border-[#5a6c7d] disabled:opacity-40"
>
Back
</button>


<span className="text-[#5a6c7d] font-medium">
Page {safePage} of {safeTotalPages}
</span>

<button
disabled={safePage === safeTotalPages}

onClick={(e) => {
  e.preventDefault();
  setPage(p => Math.min(p + 1, safeTotalPages));
}}
className="px-6 py-2 rounded-full bg-[#002c3e] text-white disabled:opacity-40"
>
Next
</button>

</div>


{/* BAN MODAL */}

{confirmUser && (

<div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50">

  <div className="bg-white rounded-[28px] w-[380px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.15)]">

    {/* TITLE */}
    <h2 className="text-xl font-semibold text-[#002c3e] text-center mb-3">
      {confirmUser.status==="ACTIVE"
        ? "Ban User"
        : "Unban User"}
    </h2>

    {/* SUBTEXT */}
    <p className="text-[#5a6c7d] text-center mb-8 text-sm leading-relaxed">
  {confirmUser.status === "ACTIVE" ? (
    <>
      Are you sure you want to ban this user?
      <br />
      They will lose access immediately.
    </>
  ) : (
    "This user will regain access to the platform."
  )}
</p>

    {/* ACTION BUTTONS */}
    <div className="flex gap-4 justify-center">

      {/* CANCEL */}
      <button
        onClick={()=>setConfirmUser(null)}
        className="
        px-8 py-3
        rounded-full
        bg-[#b6b9b3]
        text-white
        font-semibold
        hover:opacity-90
        transition
        "
      >
        Cancel
      </button>

      {/* CONFIRM */}
      <button
        onClick={()=>toggleBan(confirmUser)}
        className={`
        px-8 py-3
        rounded-full
        font-semibold
        text-white
        transition
        ${
          confirmUser.status==="ACTIVE"
          ? "bg-[#ee6a59] hover:opacity-90"
          : "bg-[#002c3e] hover:opacity-90"
        }
        `}
      >
        {confirmUser.status==="ACTIVE" ? "Ban User" : "Unban"}
      </button>

    </div>

  </div>

</div>

)}

</div>

)

}


/* ---------- COMPONENTS ---------- */

function StatCard({ title, value, red, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#f5f5f5] rounded-3xl p-6 cursor-pointer 
      transition-all duration-200 hover:scale-[1.03] hover:shadow-md"
    >
      <p className="text-[16px] font-semibold text-[#5a6c7d]">
        {title}
      </p>

      <p className={`text-[48px] font-semibold tracking-wide ${
        red ? "text-[#ee6a59]" : "text-[#002c3e]"
      }`}>
        {value}
      </p>
    </div>
  );
}

function RegionCard({ regions }) {

  const values = [
    regions.APAC || 0,
    regions.EMEA || 0,
    regions.LATAM || 0,
    regions.OTHER || 0
  ];

  const max = Math.max(...values, 1); // 👈 important

  return (
    <div className="bg-[#f5f5f5] rounded-3xl p-8 relative">

      <h3 className="font-semibold text-2xl text-[#002c3e] mb-5 ">
        Users by Region
      </h3>

      <img 
        src="/Globe Icon.svg"
        alt="icon"
        className="absolute right-2 top-3 w-18 h-18 opacity-70"
      />

      <RegionRow label="APAC" value={regions.APAC || 0} max={max} color="#fc867d"/>
      <RegionRow label="EMEA" value={regions.EMEA || 0} max={max} color="#f5c475"/>
      <RegionRow label="LATAM" value={regions.LATAM || 0} max={max} color="#b5d43c"/>
      <RegionRow label="Other" value={regions.OTHER || 0} max={max} color="#0cb4ab"/>

    </div>
  );
}


function RegionRow({ label, value, color, max }) {

  const percent = (value / max) * 100;

  return (
    <div className="mb-3">

      <div className="flex justify-between text-md mb-1">
        <span className="text-[#5a6c7d] font-semibold">{label}</span>
        <span className="text-[#5a6c7d] font-semibold">{value}</span>
      </div>

      <div className="h-3 bg-[#dcdcdc] rounded-full overflow-hidden">
        <div
          style={{ width: `${percent}%`, background: color }}
          className="h-3 rounded-full transition-all duration-500"
        />
      </div>

    </div>
  );
}

const colors = ["#fc867d", "#f5c475", "#b5d43c", "#0cb4ab"];

function CountriesCard({ countries }) {

  const max = Math.max(...countries.map(c => c.users), 1); // avoid 0

  return (
    <div className="bg-[#f5f5f5] rounded-3xl p-8 relative">

      <h3 className="font-semibold text-2xl text-[#002c3e] mb-5">
        Top Countries
      </h3>

      <img 
        src="/Locator Pin Icon.svg"
        alt="icon"
        className="absolute right-1 top-3 w-18 h-18 opacity-70"
      />

      {countries.map((c, i) => (
        <CountryRow
          key={i}
          country={c._id}
          value={c.users}
          max={max}   // 👈 pass max
          color={colors[i % colors.length]}
        />
      ))}

    </div>
  );
}



function CountryRow({ country, value, color, max }) {

  const percent = (value / max) * 100;

  return (
    <div className="mb-3">

      <div className="flex justify-between text-md mb-1">
        <span className="text-[#5a6c7d] font-semibold">{country}</span>
        <span className="text-[#5a6c7d] font-semibold">{value}</span>
      </div>

      <div className="h-3 bg-[#dcdcdc] rounded-full overflow-hidden">
        <div
          style={{ width: `${percent}%`, background: color }}
          className="h-3 rounded-full transition-all duration-500"
        />
      </div>

    </div>
  );
}
 