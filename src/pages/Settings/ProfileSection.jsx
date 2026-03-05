import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProfileSection() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get("/admin/me").then(res => {
      setProfile(res.data);
    });
  }, []);

  if (!profile) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        My Profile
      </h3>

      <div className="grid grid-cols-3 gap-6 text-sm">
        <div>
          <p className="text-gray-400 uppercase text-xs">Name</p>
          <p className="font-medium text-gray-800 mt-1">
            {profile.name}
          </p>
        </div>

        <div>
          <p className="text-gray-400 uppercase text-xs">Email</p>
          <p className="font-medium text-gray-800 mt-1">
            {profile.email}
          </p>
        </div>

        <div>
          <p className="text-gray-400 uppercase text-xs">Role</p>
          <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-semibold">
            {profile.role}
          </span>
        </div>
      </div>
    </div>
  );
}