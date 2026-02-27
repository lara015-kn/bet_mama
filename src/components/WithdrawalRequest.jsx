import { useState } from "react";

export default function WithdrawalRequest() {

  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");

  const submitRequest = async () => {

    if (!amount || !upi) {
      alert("Fill all fields");
      return;
    }
    const BASE_URL = import.meta.env.VITE_API_URL
    const res = await fetch(`${BASE_URL}/api/withdrawals/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        amount: Number(amount),
        upiId: upi,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Withdrawal Requested");

    setAmount("");
    setUpi("");
  };

  return (
    <div className="withdraw-box">

      <h3>Withdraw Money</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="text"
        placeholder="UPI ID"
        value={upi}
        onChange={(e) => setUpi(e.target.value)}
      />

      <button onClick={submitRequest}>
        Request Withdraw
      </button>

    </div>
  );
}
