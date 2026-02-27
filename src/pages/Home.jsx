import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

import "../styles/home.css";

export default function Home() {

  const [matches, setMatches] = useState([]);
  const BASE_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate(); 
  useEffect(() => {

    fetch(`${BASE_URL}/api/matches`)
      .then(res => res.json())
      .then(data => {
        setMatches(data.data || []);
      })
      .catch(err => console.error(err));

  }, []);


  return (
    <div>


      {/* MAIN CONTENT */}
      <div className="main">

        {matches.map(match => (

          <div key={match.id} className="match-card">

            {/* HEADER */}
            <div className="match-header">

              <span>
                {new Date(match.startTime).toLocaleString()}
              </span>

              {match.live && (
                <span className="live">● LIVE</span>
              )}

            </div>


            {/* TEAMS */}
            <div className="teams">

              <div className="team">
                <div className="team-name">
                  {match.home}
                </div>

                <div className="score">
                  {match.score?.home || "-"} /
                  {match.score?.wickets1 || "-"} (
                  {match.score?.overs1 || "-"} ov)
                </div>
              </div>


              <div className="vs">VS</div>


              <div className="team">
                <div className="team-name">
                  {match.away}
                </div>

                <div className="score">
                  {match.score?.away || "-"} /
                  {match.score?.wickets2 || "-"} (
                  {match.score?.overs2 || "-"} ov)
                </div>
              </div>

            </div>


            {/* ODDS */}
            <div className="odds-row">

              <div className="odd-box">
                {match.odds1 || "-"}x
              </div>

              <div className="odd-box">
                {match.odds2 || "-"}x
              </div>

            </div>


            {/* BUTTON */}
            <button
              className="bet-btn"
              onClick={() => navigate(`/match/${match.id}`)} 
            >
             🏏 Place Bet
            </button>

          </div>

        ))}

      </div>


    </div>
  );
}

