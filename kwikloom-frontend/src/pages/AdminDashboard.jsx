import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching users");
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const togglePayment = async (email, currentStatus) => {
    const { error } = await supabase
      .from("users")
      .update({ payment_confirmed: !currentStatus })
      .eq("email", email);

    if (error) {
      toast.error("Error updating payment");
    } else {
      toast.success(
        `Payment ${!currentStatus ? "confirmed" : "revoked"} for ${email}`
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.email === email ? { ...u, payment_confirmed: !currentStatus } : u
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-cyan-300">
        🔐 Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-cyan-200">Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-cyan-600">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="border border-cyan-500 px-4 py-2">#</th>
                <th className="border border-cyan-500 px-4 py-2">Email</th>
                <th className="border border-cyan-500 px-4 py-2">Referral Code</th>
                <th className="border border-cyan-500 px-4 py-2">Referred By</th>
                <th className="border border-cyan-500 px-4 py-2">Paid</th>
                <th className="border border-cyan-500 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.email}
                  className={`text-center ${
                    user.payment_confirmed ? "bg-green-900" : "bg-red-900"
                  }`}
                >
                  <td className="border border-cyan-500 px-2 py-1">{i + 1}</td>
                  <td className="border border-cyan-500 px-2 py-1">
                    {user.email}
                  </td>
                  <td className="border border-cyan-500 px-2 py-1">
                    {user.referral_code}
                  </td>
                  <td className="border border-cyan-500 px-2 py-1">
                    {user.referred_by || "-"}
                  </td>
                  <td className="border border-cyan-500 px-2 py-1">
                    {user.payment_confirmed ? "✅ Yes" : "❌ No"}
                  </td>
                  <td className="border border-cyan-500 px-2 py-1">
                    <button
                      onClick={() =>
                        togglePayment(user.email, user.payment_confirmed)
                      }
                      className={`px-3 py-1 rounded text-white font-semibold ${
                        user.payment_confirmed
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      } transition duration-300`}
                    >
                      {user.payment_confirmed ? "Revoke" : "Confirm"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
