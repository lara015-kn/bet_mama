import { useState, useEffect } from "react";

export default function QuestionForm({
  matchId,
  onClose,
  existing,
  inline
}) {

  const [form, setForm] = useState({
    matchId,
    question: "",
    team1: "",
    team2: "",
    odds1: "",
    odds2: "",
    question_won: "",
    to_be_kept: true
  });


  /* Load existing data (edit mode) */
  useEffect(() => {

    if (existing) {
      setForm(existing);
    }

  }, [existing]);

  const BASE_URL = import.meta.env.VITE_API_URL
  const submit = async () => {

    const url = existing
      ? `${BASE_URL}/api/questions/${existing._id}`
      : `${BASE_URL}/api/questions/add`;

    const method = existing ? "PUT" : "POST";


    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(form)
    });

    onClose();
  };


  return (
   <div className={`question-form ${inline ? "inline-form" : ""}`}>

  <div className="form-grid">

    <input
      placeholder="Question"
      value={form.question || ""}
      onChange={e =>
        setForm({ ...form, question: e.target.value })
      }
    />

    <input
      placeholder="Team 1"
      value={form.team1 || ""}
      onChange={e =>
        setForm({ ...form, team1: e.target.value })
      }
    />

    <input
      placeholder="Team 2"
      value={form.team2 || ""}
      onChange={e =>
        setForm({ ...form, team2: e.target.value })
      }
    />

    <input
      placeholder="Odds 1"
      value={form.odds1 || ""}
      onChange={e =>
        setForm({ ...form, odds1: e.target.value })
      }
    />

    <input
      placeholder="Odds 2"
      value={form.odds2 || ""}
      onChange={e =>
        setForm({ ...form, odds2: e.target.value })
      }
    />

    <input
      placeholder="Winner"
      value={form.question_won || ""}
      onChange={e =>
        setForm({ ...form, question_won: e.target.value })
      }
    />

  </div>


  <div className="form-bottom">

    <label>
      Active
      <input
        type="checkbox"
        checked={form.to_be_kept}
        onChange={e =>
          setForm({
            ...form,
            to_be_kept: e.target.checked
          })
        }
      />
    </label>


    <div className="form-actions">
      <button onClick={submit}>
        Update
      </button>

      <button onClick={onClose}>
        Cancel
      </button>
    </div>

  </div>

</div>
  );
}