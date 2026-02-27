const BASE = "http://localhost:5000/api/matches";

export async function fetchMatches() {
  const res = await fetch(BASE);
  return res.json();
}
