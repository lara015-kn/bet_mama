import { useEffect, useState } from "react";
import QuestionEditor from "../components/QuestionEditor";
import "../styles/loader.css";

export default function LoaderPanel() {

  const [matchId, setMatchId] = useState("");
  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL


  /* ================= LOAD MATCHES ================= */

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/api/questions/matches`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (res.ok) {
        setMatches(data);
      }

    } catch (err) {
      console.error("Load failed", err);
    }
  };



  /* ================= ADD MATCH ================= */

  const addMatch = async () => {

    if (!matchId.trim()) {
      return alert("Enter match id");
    }

    try {

      const res = await fetch(
        `${BASE_URL}/api/questions/match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            matchId: matchId.trim()
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Failed");
      }

      setMatchId("");
      loadMatches();

    } catch (err) {
      console.error(err);
    }
  };



  /* ================= DELETE MATCH ================= */

  const deleteMatch = async (id) => {

    if (!window.confirm("Delete all questions?")) return;

    try {

      await fetch(
        `${BASE_URL}/api/questions/match/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      setSelected(null);
      loadMatches();

    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div className="loader-layout">

      {/* LEFT */}
      <div className="loader-left">

        <h3>Matches</h3>

        <div className="add-match">

          <input
            placeholder="Match ID"
            value={matchId}
            onChange={e => setMatchId(e.target.value)}
          />

          <button onClick={addMatch}>➕</button>

        </div>


        {/* MATCH LIST */}
        {matches.map(m => (

          <div
            key={m}
            className={`match-item ${
              selected === m ? "active" : ""
            }`}
          >

            <span onClick={() => setSelected(m)}>
              {m}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteMatch(m)}
            >
              ❌
            </button>

          </div>
        ))}

      </div>



      {/* RIGHT */}
      <div className="loader-right">

        {selected ? (

          <QuestionEditor matchId={selected} />

        ) : (
          <div className="empty-panel">
            Select Match
          </div>
        )}

      </div>

    </div>
  );
}