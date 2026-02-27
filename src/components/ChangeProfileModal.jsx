import { useState } from "react";
import { useUser } from "../context/AuthContext";
import "../styles/modal.css";

export default function ChangeProfileModal({ onClose }) {

  const { user, setUser } = useUser();

  const [username, setUsername] = useState(user?.username || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL


  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    if (!username.trim()) {
      setError("Username required");
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setError("Password too short");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
  setError("Passwords do not match");
  return;
}


    try {

      setLoading(true);
      setError("");
      

      const res = await fetch(
        `${BASE_URL}/api/auth/update-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",

          body: JSON.stringify({
            username,
            oldPassword,
            newPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // Update context
      setUser(data.user);

      alert("Profile updated");

      onClose();

    } catch (err) {
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };



  return (
  <div className="modal-overlay">

    {/* Modal Box */}
    <div className="modal-box">

      <h3>Update Profile</h3>


      {error && (
        <div className="error-box">
          {error}
        </div>
      )}


      {/* Username */}
      <input
        type="text"
        placeholder="New Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />


      {/* Old Password */}
      <input
        type="password"
        placeholder="Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />


      {/* New Password */}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />


      {/* Confirm Password */}
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />


      {/* Buttons */}
      <div className="modal-actions">

        <button
          className="btn cancel"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="btn save"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>

      </div>

    </div>
  </div>
);

}
