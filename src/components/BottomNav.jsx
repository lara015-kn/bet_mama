import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {

  const loc = useLocation();

  const active = (p) =>
    loc.pathname === p ? "text-red-600" : "text-gray-500";

  return (
    <div className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2">

      <Link to="/" className={active("/")}>Home</Link>

      <Link to="/mybets" className={active("/mybets")}>My Bets</Link>

      <Link to="/profile" className={active("/profile")}>Profile</Link>

    </div>
  );
}
