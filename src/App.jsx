
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "./context/AuthContext";
import UpdaterPanel from "./pages/UpdaterPanel";
import LoaderPanel from "./pages/LoaderPanel";
import Navbar from "./components/Navbar";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { FaTicketAlt } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import Home from "./pages/Home";
import MatchDetails from "./pages/MatchDetails";
import MyBets from "./pages/MyBets";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {

  const { refreshUser, user } = useUser();


  /* ================= AUTO REFRESH USER ================= */

  useEffect(() => {

    if (!user) return;

    // Refresh immediately
    refreshUser();

    // Refresh every 15 sec
    const interval = setInterval(() => {
      refreshUser();
    }, 15000);

    return () => clearInterval(interval);

  }, [user, refreshUser]);


  return (
    <BrowserRouter>

      {/* ================= TOP NAVBAR ================= */}
      <Navbar />



      {/* ================= ROUTES ================= */}

      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />


        {/* USER ROUTES */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match/:id"
          element={
            <ProtectedRoute>
              <MatchDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mybets"
          element={
            <ProtectedRoute>
              <MyBets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />


        {/* ADMIN ROUTES */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/withdrawals"
          element={
            <ProtectedRoute adminOnly>
              <AdminWithdrawals />
            </ProtectedRoute>
          }
        />

        <Route
        path="/updater"
        element={
          <ProtectedRoute updaterOnly>
            <UpdaterPanel />
          </ProtectedRoute>
        }
      />

      <Route
        path="/loader"
        element={
          <ProtectedRoute loaderOnly>
            <LoaderPanel />
          </ProtectedRoute>
        }
      />

      </Routes>


      {/* ================= BOTTOM NAV ================= */}

      {user && (
  <div className="bottom-nav">

    <Link
      to="/"
      className={`nav-item ${
        location.pathname === "/" ? "active" : ""
      }`}
    >
      <AiFillHome size={22} />
      <span>Home</span>
    </Link>

    <Link
      to="/mybets"
      className={`nav-item ${
        location.pathname === "/mybets" ? "active" : ""
      }`}
    >
      <FaTicketAlt size={20} />
      <span>My Bets</span>
    </Link>

    <Link
      to="/history"
      className={`nav-item ${
        location.pathname === "/history" ? "active" : ""
      }`}
    >
      <MdHistory size={22} />
      <span>History</span>
    </Link>

  </div>
)}

    </BrowserRouter>
  );
}
