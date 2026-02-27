import { useState, useEffect } from "react";

export default function MatchEditor({ match, onUpdated }) {

  const [form, setForm] = useState({});


  /* Load selected match */
  useEffect(() => {
    setForm(match);
  }, [match]);


  /* Update field */
  const update = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };


  /* Save */
  const BASE_URL = import.meta.env.VITE_API_URL
  const save = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/api/updater/update/${match._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",

          body: JSON.stringify(form)
        }
      );

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      alert("✅ Updated");
      onUpdated();

    } catch (err) {
      alert("Server error");
    }
  };


  return (
    <div className="editor">

      <h3>
        {form.home} vs {form.away}
      </h3>


      {/* LIVE STATUS */}
      <div className="editor-row">

        <label>Live</label>

        <select
          value={form.live ? "yes" : "no"}
          onChange={e =>
            update("live", e.target.value === "yes")
          }
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>

      </div>


      {/* HOME */}
      <h4>Home Team</h4>

      <input
        type="number"
        placeholder="Runs"
        value={form.homeRuns || ""}
        onChange={e => update("homeRuns", e.target.value)}
      />

      <input
        type="number"
        placeholder="Wickets"
        value={form.homeWickets || ""}
        onChange={e => update("homeWickets", e.target.value)}
      />

      <input
        placeholder="Overs"
        value={form.homeOvers || ""}
        onChange={e => update("homeOvers", e.target.value)}
      />


      {/* AWAY */}
      <h4>Away Team</h4>

      <input
        type="number"
        placeholder="Runs"
        value={form.awayRuns || ""}
        onChange={e => update("awayRuns", e.target.value)}
      />

      <input
        type="number"
        placeholder="Wickets"
        value={form.awayWickets || ""}
        onChange={e => update("awayWickets", e.target.value)}
      />

      <input
        placeholder="Overs"
        value={form.awayOvers || ""}
        onChange={e => update("awayOvers", e.target.value)}
      />


      {/* WINNER */}
      <h4>Result</h4>

      <select
        value={form.winner || ""}
        onChange={e => update("winner", e.target.value)}
      >
        <option value="">Select Winner</option>
        <option value={form.home}>{form.home}</option>
        <option value={form.away}>{form.away}</option>
        <option value="draw">Draw</option>
      </select>


      {/* SAVE */}
      <button
        className="update-btn"
        onClick={save}
      >
        💾 Save Update
      </button>

    </div>
  );
}