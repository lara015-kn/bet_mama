import { useEffect, useState } from "react";
import "../styles/admin.css";
import AdminReports from "./AdminReports";

export default function AdminDashboard() {

  const [tab, setTab] = useState("users");
  const BASE_URL = import.meta.env.VITE_API_URL
  const [withdrawals, setWithdrawals] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");
  // Add Money
  const [moneyUser, setMoneyUser] = useState("");
  const [moneyAmount, setMoneyAmount] = useState("");
  const [userBalance, setUserBalance] = useState(null);


  /* ================= LOAD WITHDRAWALS ================= */

  const loadWithdrawals = async () => {

    const res = await fetch(
      `${BASE_URL}/api/withdrawals/all`,
      { credentials: "include" }
    );

    const data = await res.json();

    setWithdrawals(data);
  };


  useEffect(() => {
    loadWithdrawals();
  }, []);


  /* ================= ADD USER ================= */

  const handleAddUser = async () => {

    if (!username || !password) {
      alert("Enter username and password");
      return;
    }

    const res = await fetch(
      `${BASE_URL}/api/admin/add-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",

        body: JSON.stringify({
          username,
          password,
          balance: Number(balance)
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("✅ User Created");

    setUsername("");
    setPassword("");
    setBalance("");
  };


  /* ================= APPROVE ================= */

  const approve = async (id) => {

    await fetch(
      `${BASE_URL}/api/withdrawals/approve/${id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    loadWithdrawals();
  };


  /* ================= REJECT ================= */

  const reject = async (id) => {

    await fetch(
      `${BASE_URL}/api/withdrawals/reject/${id}`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    loadWithdrawals();
  };

  /* ================= FETCH USER BALANCE ================= */

const fetchBalance = async () => {

  if (!moneyUser.trim()) {
    alert("Enter username");
    return;
  }

  try {

    const res = await fetch(
      `${BASE_URL}/api/admin/user/${moneyUser}`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    setUserBalance(data.balance);

  } catch (err) {
    alert("Failed to load user");
  }
};

    /* ================= ADD MONEY ================= */

const handleAddMoney = async () => {

  if (!moneyAmount || moneyAmount <= 0) {
    alert("Enter valid amount");
    return;
  }

  try {

    const res = await fetch(
      `${BASE_URL}/api/admin/add-money`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({
          username: moneyUser,
          amount: Number(moneyAmount),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("✅ Money Added");

    setUserBalance(data.balance);
    setMoneyAmount("");

  } catch (err) {
    alert("Server error");
  }
};


  /* ================= UI ================= */

  return (
    <div className="admin-container">


      {/* HEADER */}
      <h1 className="admin-title">
        Admin Panel
      </h1>


      {/* TABS */}
      <div className="admin-tabs">

        <button
          className={tab === "users" ? "active" : ""}
          onClick={() => setTab("users")}
        >
          ➕ Add User
        </button>

        <button
          className={tab === "withdrawals" ? "active" : ""}
          onClick={() => setTab("withdrawals")}
        >
          💰 Withdraw Requests
        </button>

        <button
          className={tab === "money" ? "active" : ""}
          onClick={() => setTab("money")}
        >
          ➕ Add Money
        </button>

          <button
            className={tab === "reports" ? "active" : ""}
            onClick={() => setTab("reports")}
          >
            📊 Reports
          </button>


      </div>


      {/* ================= ADD USER ================= */}

      {tab === "users" && (

        <div className="admin-card">

          <h3>Create New User</h3>

          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <input
            type="number"
            placeholder="Initial Balance"
            value={balance}
            onChange={e => setBalance(e.target.value)}
          />

          <button
            className="primary-btn"
            onClick={handleAddUser}
          >
            Create User
          </button>

        

        </div>
      )}


      {/* ================= WITHDRAWALS ================= */}

      {tab === "withdrawals" && (

        <div className="withdraw-list">

          {withdrawals.length === 0 && (
            <p className="empty-text">
              No withdrawal requests
            </p>
          )}

          {withdrawals.map(w => (

            <div key={w._id} className="withdraw-card">

              <div className="withdraw-row">
                <span>User</span>
                <b>{w.userId?.username}</b>
              </div>

              <div className="withdraw-row">
                <span>Balance</span>
                <b>₹ {w.userId?.balance}</b>
              </div>

              <div className="withdraw-row">
                <span>Amount</span>
                <b>₹ {w.amount}</b>
              </div>

              <div className="withdraw-row">
                <span>UPI</span>
                <b>{w.upiId}</b>
              </div>

              <div className="withdraw-row">
                <span>Status</span>
                <b className={w.status.toLowerCase()}>
                  {w.status}
                </b>
              </div>


              {w.status === "PENDING" && (

                <div className="withdraw-actions">

                  <button
                    className="approve"
                    onClick={() => approve(w._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject"
                    onClick={() => reject(w._id)}
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      )}


    {/* ================= ADD MONEY ================= */}

{tab === "money" && (

  <div className="admin-card">

    <h3>Add Money to User</h3>

    <input
      placeholder="Username"
      value={moneyUser}
      onChange={e => setMoneyUser(e.target.value)}
    />

    <button
      className="primary-btn"
      onClick={fetchBalance}
    >
      Check Balance
    </button>


    {userBalance !== null && (

      <>
        <p className="balance-text">
          Current Balance: ₹ {userBalance}
        </p>

        <input
          type="number"
          placeholder="Enter Amount"
          value={moneyAmount}
          onChange={e => setMoneyAmount(e.target.value)}
        />

        <button
          className="primary-btn"
          onClick={handleAddMoney}
        >
          Add Money
        </button>
      </>
    )}

  </div>
)}

{tab === "reports" && (
  <AdminReports />
)}


    </div>
  );
}
