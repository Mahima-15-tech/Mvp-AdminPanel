import { useEffect, useState } from "react";
import api from "../api/axios";
import { Search } from "lucide-react";

export default function SupportTickets() {

  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await api.get("/support");
    setTickets(res.data);
  };

  const filteredTickets = tickets.filter(ticket => {

    const matchStatus =
      filter === "ALL" || ticket.status === filter;

    const matchSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.email.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8">

      {/* <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Support Tickets
        </h1>
        <p className="text-gray-500 mt-2">
          Manage user support requests
        </p>
      </div> */}

      {/* Filters */}
      <div className="flex justify-between items-center">

        <div className="flex gap-3">
          {["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filter === status
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-4 text-left">User</th>
              <th className="px-6 py-4 text-left">Subject</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {filteredTickets.map(ticket => (
              <tr
                key={ticket._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4">
                  {ticket.userId?.name || "User"}
                  <div className="text-xs text-gray-400">
                    {ticket.email}
                  </div>
                </td>

                <td className="px-6 py-4 font-medium text-gray-700">
                  {ticket.subject}
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={ticket.status} />
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelected(ticket)}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* Modal */}
      {selected && (
        <TicketModal
          ticket={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </div>
  );
}

function StatusBadge({ status }) {

    const colors = {
      OPEN: "bg-red-100 text-red-600",
      IN_PROGRESS: "bg-yellow-100 text-yellow-700",
      RESOLVED: "bg-green-100 text-green-600",
    };
  
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.replace("_", " ")}
      </span>
    );
  }


  function TicketModal({ ticket, onClose, refresh }) {

    const [status, setStatus] = useState(ticket.status);
    const [priority, setPriority] = useState(ticket.priority);
    const [reply, setReply] = useState("");
  
    const updateTicket = async () => {
      await api.put(`/support/${ticket._id}`, {
        status,
        priority
      });
      refresh();
    };
  
    const sendReply = async () => {
      if (!reply) return;
  
      await api.post(`/support/${ticket._id}/reply`, {
        message: reply
      });
  
      setReply("");
      refresh();
    };
  
    const getSlaHours = () => {
      const created = new Date(ticket.createdAt);
      const now = new Date();
      return Math.floor((now - created) / (1000 * 60 * 60));
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
    
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
    
          {/* HEADER */}
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-start">
    
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {ticket.subject}
              </h2>
    
              <div className="flex items-center gap-4 mt-2">
    
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">
                  SLA: {getSlaHours()} hrs
                </span>
    
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  priority === "HIGH"
                    ? "bg-red-100 text-red-600"
                    : priority === "MEDIUM"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}>
                  {priority}
                </span>
    
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  status === "RESOLVED"
                    ? "bg-green-100 text-green-600"
                    : status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {status.replace("_", " ")}
                </span>
    
              </div>
            </div>
    
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
    
          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
    
            {/* Status Controls */}
            <div className="flex flex-wrap items-center gap-4">
    
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>OPEN</option>
                <option>IN_PROGRESS</option>
                <option>RESOLVED</option>
              </select>
    
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
              </select>
    
              <button
                onClick={updateTicket}
                className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              >
                Update Ticket
              </button>
    
            </div>
    
            {/* Original Message Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <p className="text-gray-700 leading-relaxed">
                {ticket.description}
              </p>
            </div>
    
            {/* Thread */}
            <div className="space-y-5">
    
              {ticket.replies.map((r, i) => {
    
                const isAdmin = r.sender === "ADMIN";
    
                return (
                  <div
                    key={i}
                    className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                  >
    
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        isAdmin
                          ? "bg-indigo-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-700 rounded-bl-md"
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {r.sender}
                      </div>
                      {r.message}
                    </div>
    
                  </div>
                );
              })}
    
            </div>
    
          </div>
    
          {/* FOOTER (Reply Section) */}
          <div className="border-t border-gray-200 px-8 py-6 bg-white">
    
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write a reply..."
              className="w-full border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              rows={3}
            />
    
            <div className="flex justify-end mt-4">
              <button
                onClick={sendReply}
                className="px-8 py-2 rounded-xl bg-gray-900 text-white font-medium hover:bg-black transition"
              >
                Send Reply
              </button>
            </div>
    
          </div>
    
        </div>
      </div>
    );
  }