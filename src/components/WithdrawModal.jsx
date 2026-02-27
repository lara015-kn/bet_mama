import { useState } from "react";
import "../styles/modal.css";

export default function WithdrawModal({ onClose }) {

  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL

  const handleSubmit = async () => {

    if (!amount || !upiId) {
      alert("Enter amount and UPI ID");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/api/withdrawals/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            amount: Number(amount),
            upiId
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      alert("✅ Withdrawal Requested");

      onClose();

    } catch (err) {

      console.error(err);
      alert("Server error");

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="modal-overlay">

      <div className="modal-box">

        <h2>Withdraw Amount</h2>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter UPI ID"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
        />

        <div className="modal-actions">

          <button onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </button>

        </div>

      </div>

    </div>
  );
}
