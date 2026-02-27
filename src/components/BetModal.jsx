import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function BetModal({ bet, onClose }) {

  const { placeBet } = useUser();

  const [amount, setAmount] = useState("");

  const returns = (amount * bet.odds || 0).toFixed(2);

  const submit = () => {

    if (amount < 50) {
      alert("Min bet ₹50");
      return;
    }

    placeBet({
      ...bet,
      amount: Number(amount),
      returns
    });

    onClose();
  };

  return (
    <div className="modal-bg">

      <div className="modal">

        <div className="bet-header">
          {bet.team} @ {bet.odds}
        </div>

        <input
          className="amount-input"
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />

        <div className="quick-btns">
          {[25,100,500,2500].map(v => (
            <button key={v} onClick={() => setAmount(v)}>
              +{v}
            </button>
          ))}
        </div>

        <div className="return-box">
          Possible Win: ₹ {returns}
        </div>

        <button className="place-btn" onClick={submit}>
          Place Bet
        </button>

      </div>

    </div>
  );
}
