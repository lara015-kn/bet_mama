import { useState, useEffect } from "react";
import { useUser } from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/red_ball.png"; // adjust path if needed
import UserPanel from "./UserPanel";
import "../styles/navbar.css";

export default function Navbar() {

  const { user } = useUser();

  const [open, setOpen] = useState(false);


  /* Close panel on logout */
  useEffect(() => {
    if (!user) {
      setOpen(false);
    }
  }, [user]);


  return (
    <>
      <div className="header">

        {/* LEFT PLACEHOLDER (Keeps logo centered) */}
        <div className="nav-left"></div>


        {/* LOGO */}
        <div className="brand-box">
  <img src={logo} alt="Logo" className="brand-logo" />
  <span className="brand-text">BET MAMA</span>
</div>



        {/* RIGHT SIDE */}
        <div className="nav-right">

          {user && (
            <>
              {/* BALANCE */}
              <div className="balance-box">
                ₹ {user.balance ?? 0}
              </div>

              {/* MENU */}
              <div
                className="user-btn"
                onClick={() => setOpen(true)}
              >
                ☰
              </div>

              {/* ADMIN */}
              {user?.role === "admin" && (
                <Link to="/admin" className="admin-link">
                  Admin
                </Link>
              )}

              {/* UPDATER */}
              {user?.role === "updater" && (
                <Link to="/updater" className="updater-link">
                  Live Panel
                </Link>
              )}

              {user?.role === "loader" && (
                <Link to="/loader" className="loader-link">
                  Question Panel
                </Link>
              )}
            </>
          )}

        </div>

      </div>


      {/* USER PANEL */}
      {open && user && (
        <UserPanel onClose={() => setOpen(false)} />
      )}
    </>
  );
}
