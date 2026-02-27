import { useEffect, useState } from "react";
import "../styles/history.css";

export default function History() {

  const [bets, setBets] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL
  useEffect(() => {

    fetch(`${BASE_URL}/api/bets/history`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setBets(data.bets || []);
      });

  }, []);

  const getClass = (status) => {

    if (status === "WON") return "win";
    if (status === "LOST") return "lost";
    if (status === "DRAW") return "draw";

    return "";
  };

  return (
    <div className="page">

      <h2 className="page-title">History</h2>

      {bets.length === 0 && (
        <p className="empty">No History Found</p>
      )}

      {bets.map(bet => (

        <div
          key={bet._id}
          className={`history-card ${getClass(bet.status)}`}
        >

          <div className="row">
            <b>{bet.teamSelected}</b>
            <span>{bet.status}</span>
          </div>

          <div className="row">
            Amount: ₹ {bet.amount}
          </div>

          <div className="row">
            Profit: ₹ {bet.profit}
          </div>

          <div className="row time">
            {new Date(bet.createdAt).toLocaleString()}
          </div>

        </div>

      ))}

    </div>
  );
}
