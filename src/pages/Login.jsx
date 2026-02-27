import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/AuthContext";
import "../styles/login.css";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useUser();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!username || !password) {
      setError("Enter username and password");
      return;
    }

    try {

      setError("");

      await login(username, password);

      navigate("/");

    } catch (err) {

      setError("Invalid credentials");

    }
  };


  return (
    <div className="login-page">

      <form
        className="login-card"
        onSubmit={handleSubmit}
      >

        <h2 className="login-title">
          Login to WIN 💵
        </h2>


        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />


        <button type="submit">
          Login
        </button>

        {/* TRUST TEXT */}
      <p className="secure-text">
        🔒 100% Secure & Fast Withdrawal
      </p>

      </form>

    </div>
  );
}
