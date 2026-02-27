import { useState } from "react";
import "../styles/admin.css";

export default function AdminAddMoney() {

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");


  /* ================= FETCH USER ================= */

  const fetchUser = async () => {

    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    try {

      setLoading(true);
      setMsg("");

      const res = await fetch(
        `${BASE_URL}/api/admin/user/${username}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setBalance(data.balance);

    } catch (err) {
      alert("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };


  /* ================= ADD MONEY ================= */

  const handleAdd = async () => {

    if (!amount || amount <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/admin/add-money`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",

          body: JSON.stringify({
            username,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setBalance(data.balance);
      setAmount("");

      setMsg("✅ Money added successfully");

    } catch (err) {

      alert("Server error");

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="admin-card">

      <h2>Add Money</h2>


      {msg && <p className="success">{msg}</p>}


      {/* Username */}
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />


      <button onClick={fetchUser}>
        Check Balance
      </button>


      {/* Balance */}
      {balance !== null && (
        <p className="balance-text">
          Current Balance: ₹ {balance}
        </p>
      )}


      {/* Amount */}
      {balance !== null && (
        <>
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Money"}
          </button>
        </>
      )}

    </div>
  );
}
