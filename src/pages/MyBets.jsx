import { useEffect, useState } from "react";
import "../styles/mybets.css";

export default function MyBets() {

  const [bets, setBets] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL
  const fetchBets = () => {
    fetch(`${BASE_URL}/api/bets/my`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        setBets(data.bets || []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {

    fetchBets();

    // auto refresh every 10 seconds
    const timer = setInterval(fetchBets, 10000);

    return () => clearInterval(timer);

  }, []);


  return (
    <div>

      <div className="main">

        <h2 className="page-title">My Bets</h2>


        {bets.length === 0 && (
          <div className="empty">
            No Bets Yet
          </div>
        )}


        {bets.map(bet => (

          <div key={bet._id} className="bet-card">

            <div className="bet-top">

              <div className="match-id">
                {bet.matchId}
              </div>

              <div className={`status ${bet.status.toLowerCase()}`}>
                {bet.status}
              </div>

            </div>


            <div className="bet-details">

              <div>
                <strong>Selected:</strong> {bet.teamSelected}
              </div>

              <div>
                <strong>Odds:</strong> {bet.odds}x
              </div>

              <div>
                <strong>Amount:</strong> ₹{bet.amount}
              </div>

              <div>
                <strong>Possible Win:</strong> ₹{bet.possibleWin}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
