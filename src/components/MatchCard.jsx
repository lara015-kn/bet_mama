export default function MatchCard({ match, onSelect }) {

  return (
    <div className="match-card">

      <div className="teams">
        <span>{match.home}</span>
        <span>VS</span>
        <span>{match.away}</span>
      </div>

      <div className="score">
        {match.score?.home}/{match.score?.wickets1} ({match.score?.overs1})
      </div>

      <div className="odds-row">

        <button
          className="odds-btn"
          onClick={() => onSelect(match, match.home, match.odds1)}
        >
          {match.home} @ {match.odds1}
        </button>

        <button
          className="odds-btn"
          onClick={() => onSelect(match, match.away, match.odds2)}
        >
          {match.away} @ {match.odds2}
        </button>

      </div>

    </div>
  );
}
