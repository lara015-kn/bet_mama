import { useEffect, useState } from "react";
import QuestionForm from "./QuestionForm";
export default function QuestionEditor({ matchId }) {

  const [questions, setQuestions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  // const [edit, setEdit] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, [matchId]);

  const BASE_URL = import.meta.env.VITE_API_URL
  const load = async () => {

    const res = await fetch(
      `${BASE_URL}/api/questions/${matchId}`,
      { credentials: "include" }
    );

    setQuestions(await res.json());
  };


  return (
    <div>

      <h3>{matchId}</h3>

      <button className="add-question-btn" onClick={() => setShowAdd(true)}>
  ➕ Add Question
</button>


      {showAdd && (
        <QuestionForm
          matchId={matchId}
          onClose={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}

      {editId && (

  <QuestionForm
    existing={editId}
    matchId={matchId}
    onClose={() => {
      setEditId(null);
      load();
    }}
  />

)}


      {questions.map(q => (

  <div key={q._id} className="question-card">

    <div className="question-header">

      <b>{q.question || "Placeholder"}</b>

      <div className="question-actions">

        <button
          className="edit-btn"
          onClick={() =>
            setEditId(editId === q._id ? null : q._id)
          }
        >
          ✏️ Edit
        </button>

        <button
          className="delete-btn"
          onClick={async () => {

            if (!window.confirm("Delete this question?")) return;
            const BASE_URL = import.meta.env.VITE_API_URL
            await fetch(
              `${BASE_URL}/api/questions/${q._id}`,
              {
                method: "DELETE",
                credentials: "include"
              }
            );

            load();
          }}
        >
          🗑️
        </button>

      </div>
    </div>


    <div className="question-meta">
      Active:
      <input
        type="checkbox"
        checked={q.to_be_kept}
        onChange={async () => {
          const BASE_URL = import.meta.env.VITE_API_URL
          await fetch(
            `${BASE_URL}/api/questions/${q._id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                to_be_kept: !q.to_be_kept
              })
            }
          );

          load();
        }}
      />
    </div>


    {/* ✅ EDIT FORM BELOW CARD */}
    {editId === q._id && (
      <QuestionForm
        existing={q}
        matchId={matchId}
        inline
        onClose={() => {
          setEditId(null);
          load();
        }}
      />
    )}

  </div>
))}


    </div>
  );
}