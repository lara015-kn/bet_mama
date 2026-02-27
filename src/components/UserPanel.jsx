import { useState } from "react";
import { useUser } from "../context/AuthContext";
import ChangeProfileModal from "./ChangeProfileModal";
import "../styles/userpanel.css";
import WithdrawModal from "./WithdrawModal";
import { useNavigate } from "react-router-dom";

export default function UserPanel({ onClose }) {

  const { logout } = useUser();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/login", { replace: true });
  };


  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  return (
    <>
      {/* Background */}
      <div className="overlay" onClick={onClose}></div>

      {/* Drawer */}
      <div className="drawer">

        <div className="user-info">

  <div className="user-left">
    <div className="user-avatar">👤</div>

    <div className="user-details">
      <div className="user-name">{user.username}</div>
      <div className="user-balance">₹ {user.balance}</div>
    </div>
  </div>

  <button className="close-btn" onClick={onClose}>
    ✕
  </button>

</div>


        <div className="drawer-body">

          <button
            className="drawer-btn"
            onClick={() => setShowProfileModal(true)}
          >
            Change Username / Password
          </button>

          <button
            className="drawer-btn"
            onClick={() => setShowWithdrawModal(true)}
          >
            Request Withdrawal
          </button>



          <button
            className="drawer-btn logout"
            onClick={handleLogout}
            >
            Logout
            </button>


        </div>

      </div>

      {/* Modal */}
      {showProfileModal && (
        <ChangeProfileModal
          onClose={() => setShowProfileModal(false)}
        />
      )}
      {showWithdrawModal && (
  <WithdrawModal
    onClose={() => setShowWithdrawModal(false)}
  />
)}

    </>
  );
}
