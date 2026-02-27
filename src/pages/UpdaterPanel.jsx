import { useEffect, useState } from "react";
import MatchEditor from "../components/MatchEditor";
import "../styles/updater.css";

export default function UpdaterPanel() {

  const [matches, setMatches] = useState([]);
  const [selected, setSelected] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL
  const [matchId, setMatchId] = useState("");
  const [home, setHome] = useState("");
  const [away, setAway] = useState("");


  useEffect(() => {
    loadMatches();
  }, []);
  const deleteMatch = async (id) => {

  const ok = window.confirm(
    "Are you sure you want to delete this match?"
  );

  if (!ok) return;

  try {

    const res = await fetch(
      `${BASE_URL}/api/updater/delete/${id}`,
      {
        method: "DELETE",
        credentials: "include"
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }

    alert("✅ Match deleted");

    // Clear editor if deleted
    if (selected?._id === id) {
      setSelected(null);
    }

    loadMatches();

  } catch (err) {
    alert("Server error");
  }
};

  const loadMatches = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/api/updater/all`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      setMatches(data);

    } catch {
      alert("Cannot load matches");
    }
  };


  const addMatch = async () => {

    if (!matchId || !home || !away) {
      return alert("Fill all fields");
    }

    try {

      const res = await fetch(
        `${BASE_URL}/api/updater/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",

          body: JSON.stringify({
            matchId,
            home,
            away
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Match Added");

      setMatchId("");
      setHome("");
      setAway("");

      loadMatches();

    } catch {
      alert("Add failed");
    }
  };


  return (
    <div className="updater-layout">


      {/* LEFT */}
      <div className="updater-left">

        <h3>Matches</h3>

        <div className="add-box">

          <input
            placeholder="Match ID"
            value={matchId}
            onChange={e => setMatchId(e.target.value)}
          />

          <input
            placeholder="Home"
            value={home}
            onChange={e => setHome(e.target.value)}
          />

          <input
            placeholder="Away"
            value={away}
            onChange={e => setAway(e.target.value)}
          />

          <button onClick={addMatch}>
            Add
          </button>

        </div>


        {matches.map(m => (
  <div
    key={m._id}
    className={`match-item ${
      selected?._id === m._id ? "active" : ""
    }`}
  >

    {/* Select Match */}
    <span
      className="match-name"
      onClick={() => {
  console.log("Selected Match:", m);
  setSelected(m);
}}
    >
      {m.matchId}
    </span>

    {/* Delete Button */}
    <button
      className="delete-btn"
      onClick={() => deleteMatch(m._id)}
    >
      ❌
    </button>

  </div>
))}

      </div>


      {/* RIGHT */}
      <div className="updater-right">

        {selected ? (
          <MatchEditor
            match={selected}
            onUpdated={loadMatches}
          />
        ) : (
          <div>Select match</div>
        )}

      </div>

    </div>
  );
}