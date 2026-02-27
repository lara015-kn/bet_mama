import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/match.css";
import { useUser } from "../context/AuthContext";

export default function MatchDetails() {
  const { user, setUser, refreshUser } = useUser();

  const { id } = useParams();

  const [match, setMatch] = useState(null);
  const [myBets, setMyBets] = useState([]);
  const [selectedBet, setSelectedBet] = useState(null);
  const [amount, setAmount] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL

  /* ================= FETCH MATCH ================= */



  useEffect(() => {

  const loadData = async () => {
    try {

      // Fetch match
      const matchRes = await fetch(`${BASE_URL}/api/matches`);
      const matchData = await matchRes.json();

      const m = matchData.data.find(x => x.id === id);
      setMatch(m);

      // Fetch my bets
      const betsRes = await fetch(
        `${BASE_URL}/api/bets/my`,
        { credentials: "include" }
      );

      const betsData = await betsRes.json();
      setMyBets(betsData.bets || []);

    } catch (err) {
      console.error("Auto refresh failed", err);
    }
  };


  // First load immediately
  loadData();

  // Then every 3 seconds
  // const interval = setInterval(loadData, 3000);
  const interval = setInterval(() => {
  if (match?.live) {
    loadData();
  }
}, 3000);

  // Cleanup
  return () => clearInterval(interval);

}, [id]);


  if (!match) return <div>Loading...</div>;


  /* ================= TOGGLE HANDLER ================= */
  const handlePlaceBet = async () => {

  if (!selectedBet || !amount) {
    alert("Select odd and enter amount");
    return;
  }

  try {

    const res = await fetch(`${BASE_URL}/api/bets/place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",

      body: JSON.stringify({

        matchId: match.id,

        betType: selectedBet.type,   // h2h / question

        betKey: selectedBet.key,

        teamSelected: selectedBet.label, // ✅ IMPORTANT

        questionIndex:
    selectedBet.type === "question"
      ? selectedBet.questionIndex
      : null,

        odds: selectedBet.odds,

        amount: Number(amount)

      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Bet placed!");

    // Reload bets for exposure update
const betsRes = await fetch(
  `${BASE_URL}/api/bets/my`,
  { credentials: "include" }
);

const betsData = await betsRes.json();

setMyBets(betsData.bets || []);

    // ✅ Update balance instantly
    // Update locally
      setUser(prev => ({
        ...prev,
        balance: data.balance
      }));

      // Sync with backend (safety)
      await refreshUser();


    setAmount("");
    setSelectedBet(null);


  } catch (err) {
    console.error(err);
    alert("Bet failed");
  }
};


  const toggleBet = (betObj) => {

    if (selectedBet?.key === betObj.key) {
      setSelectedBet(null);
      setAmount("");
    } else {
      setSelectedBet(betObj);
      setAmount("");
    }

  };

  const h2hBets = myBets.filter(
        b => b.matchId === id && b.betType === "h2h"
      );

      const getExistingExposure = (team) => {
        let total = 0;

        h2hBets.forEach(bet => {
          if (bet.teamSelected === team) {
            total += bet.amount;
          }
        });

        return total;
      };

      const getH2HPreview = (team, odds) => {

  let win = 0;
  let lose = 0;

  // Existing bets
  myBets.forEach(bet => {

    if (bet.matchId !== id) return;
    if (bet.betType !== "h2h") return;

    if (bet.teamSelected === team) {

      // If THIS team wins
      win += bet.amount * bet.odds - bet.amount;

    } else {

      // If THIS team wins, others lose
      win -= bet.amount;

    }
  });

  // New bet preview
  if (selectedBet?.label === team && amount) {

    const amt = Number(amount);

    win += amt * odds - amt;

  }

  if (selectedBet && selectedBet.label !== team && amount) {

    win -= Number(amount);
  }

  return {
    profit: win > 0 ? win.toFixed(2) : "0.00",
    loss: win < 0 ? Math.abs(win).toFixed(2) : "0.00"
  };
};



  return (
    <div>



      <div className="main">


        {/* MATCH STATUS */}
        <div className="section-title">
          {match.live ? "Live Match" : "Upcoming Match"}
        </div>


        {/* SCORE */}
        <div className="score-card">

          <div className="team-block">
            <h2>{match.home}</h2>
            <p>
              {match.score?.home || "-"} /
              {match.score?.wickets1 || "-"} (
              {match.score?.overs1 || "-"} ov)
            </p>
          </div>


          <div className="team-block">
            <h2>{match.away}</h2>
            <p>
              {match.score?.away || "-"} /
              {match.score?.wickets2 || "-"} (
              {match.score?.overs2 || "-"} ov)
            </p>
          </div>

        </div>


        {/* ================= HEAD TO HEAD ================= */}

        <h3 className="sub-title">Head to Head</h3>

<div className="odds-container">

  {/* HOME */}
  <div className="odd-wrapper">

    <button
      className={`odd-box ${
        selectedBet?.key === "home" ? "active-odd" : ""
      }`}
      onClick={() =>
        toggleBet({
          type: "h2h",
          key: "home",
          label: match.home,
          odds: match.odds1
        })
      }
    >
      {match.home}
      <br />
      {match.odds1}x
    </button>

    {/* Profit / Loss Preview */}
      <div className="preview-box">

  <span className="profit">
    +₹{getH2HPreview(match.home, match.odds1).profit}
  </span>

  <span className="loss">
    -₹{getH2HPreview(match.home, match.odds1).loss}
  </span>

</div>

  </div>


  {/* AWAY */}
  <div className="odd-wrapper">

    <button
      className={`odd-box ${
        selectedBet?.key === "away" ? "active-odd" : ""
      }`}
      onClick={() =>
        toggleBet({
          type: "h2h",
          key: "away",
          label: match.away,
          odds: match.odds2
        })
      }
    >
      {match.away}
      <br />
      {match.odds2}x
    </button>

    {/* Profit / Loss Preview */}
     <div className="preview-box">

      <span className="profit">
        +₹{getH2HPreview(match.away, match.odds2).profit}
      </span>

      <span className="loss">
        -₹{getH2HPreview(match.away, match.odds2).loss}
      </span>

    </div>
    

      </div>

    </div>

        

        {/* H2H BET PANEL */}
        {selectedBet?.type === "h2h" && (
          <BetPanel
            selectedBet={selectedBet}
            amount={amount}
            setAmount={setAmount}
            onPlaceBet={handlePlaceBet}
          />

        )}


        {/* ================= FANCY BETS ================= */}

        <h3 className="sub-title">Fancy Bet</h3>


        {match.questions
          ?.filter(q => q.active)
          .map((q) => (

            <div key={q.questionId} className="question-box">

              <div className="question-title">
                {q.question}
              </div>


              <div className="odds-container">


                {/* YES */}
                <button
                  className={`odd-box ${
                    selectedBet?.key === `${q.questionId}_yes`
                      ? "active-odd"
                      : ""
                  }`}
                  onClick={() =>
                    toggleBet({
                      type: "question",
                      key: `${q.questionId}_yes`,
                      label: q.team1,          // ✅ ADD THIS
                      odds: q.odds1,
                      questionIndex: q.questionId,
                    })
                  }

                >
                  {q.team1}
                  <br />
                  {q.odds1}x
                </button>


                {/* NO */}
                <button
                  className={`odd-box ${
                    selectedBet?.key === `${q.questionId}_no`
                      ? "active-odd"
                      : ""
                  }`}
                  cons
                  onClick={() =>
                    toggleBet({
                      type: "question",
                      key: `${q.questionId}_no`,
                      label: q.team2,          // ✅ ADD THIS
                      odds: q.odds2,
                      questionIndex: q.questionId,
                    })
                  }

                >
                  {q.team2}
                  <br />
                  {q.odds2}x
                </button>

              </div>


              {/* QUESTION BET PANEL */}
              {selectedBet?.type === "question" &&
                selectedBet?.questionIndex === q.questionId && (

                  <BetPanel
                    selectedBet={selectedBet}
                    amount={amount}
                    setAmount={setAmount}
                    onPlaceBet={handlePlaceBet}
                  />


              )}

            </div>

        ))}

      </div>

    </div>
  );
}



/* ================= BET PANEL ================= */

function BetPanel({ selectedBet, amount, setAmount, onPlaceBet }) {


  const potentialWin =
    amount && selectedBet
      ? (Number(amount) * Number(selectedBet.odds)).toFixed(2)
      : 0;


  return (
    <div className="bet-panel">

      <div className="bet-header">
        Odds: {selectedBet.odds}x
      </div>


      <div className="bet-body">

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />


        <div className="returns">
          You Win ₹ {potentialWin}
        </div>


        <button
  className="place-btn"
  onClick={onPlaceBet}
>
  Place Bet
</button>


      </div>

    </div>
  );
}
