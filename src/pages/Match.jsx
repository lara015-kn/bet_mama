import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useUser } from "../context/AuthContext";

export default function Match() {

  const { id } = useParams();
  const { updateBalance } = useUser();
  const BASE_URL = import.meta.env.VITE_API_URL
  const [match, setMatch] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {

    fetch(`${BASE_URL}/api/matches`)
      .then(r => r.json())
      .then(d => {
        setMatch(d.data.find(x => x.id === id));
      });

  }, []);

  if (!match) return null;


  const placeBet = (odds) => {

    if (amount < 50) {
      alert("Min ₹50");
      return;
    }

    updateBalance(-amount);

    alert("Bet Placed!");
  };


  return (
    <div className="p-4 bg-white min-h-screen">

      <h2 className="text-2xl font-bold text-center mb-3">
        {match.home} vs {match.away}
      </h2>


      {/* SCORE */}

      {match.live &&
        <p className="text-center text-red-600 mb-3">LIVE</p>
      }


      {/* MAIN BET */}

      <div className="flex gap-3 mb-4">

        <button
          onClick={() => placeBet(match.odds1)}
          className="flex-1 bg-green-600 text-white py-2 rounded"
        >
          {match.home} @ {match.odds1}
        </button>

        <button
          onClick={() => placeBet(match.odds2)}
          className="flex-1 bg-red-600 text-white py-2 rounded"
        >
          {match.away} @ {match.odds2}
        </button>

      </div>


      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="border p-2 w-full mb-4"
      />


      {/* QUESTIONS */}

      <h3 className="font-bold mb-2">Fancy Bets</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">

        {match.questions
          .filter(q => q.active)
          .map((q,i) => (

            <div key={i} className="border p-3 rounded">

              <p>{q.question}</p>

              <div className="flex gap-2 mt-2">

                <button
                  onClick={() => placeBet(q.odds1)}
                  className="flex-1 bg-blue-500 text-white py-1 rounded"
                >
                  YES @ {q.odds1}
                </button>

                <button
                  onClick={() => placeBet(q.odds2)}
                  className="flex-1 bg-orange-500 text-white py-1 rounded"
                >
                  NO @ {q.odds2}
                </button>

              </div>

            </div>

          ))}

      </div>

    </div>
  );
}
