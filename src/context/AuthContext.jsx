import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();


export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ NEW
  const BASE_URL = import.meta.env.VITE_API_URL

  /* ================= AUTO LOAD USER ================= */

  useEffect(() => {

    const loadUser = async () => {

      try {

        const res = await fetch(
          `${BASE_URL}/api/auth/me`,
          {
            credentials: "include"
          }
        );

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        }

      } catch (err) {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };

    loadUser();

  }, []);


  /* ================= LOGIN ================= */

  const login = async (username, password) => {

    const res = await fetch(
      `${BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({ username, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    setUser(data.user);

    return data.user;
  };


  /* ================= REFRESH ================= */

  const refreshUser = async () => {

    try {

      const res = await fetch(
        `${BASE_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      }

    } catch (err) {
      console.error("Refresh failed");
    }
  };


  /* ================= LOGOUT ================= */

  const logout = async () => {

    await fetch(
      `${BASE_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    setUser(null);

    // window.location.href = "/login";
  };


  /* ================= BLOCK UNTIL LOADED ================= */

  if (loading) {
    return <div>Loading...</div>; // prevent flicker
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useUser() {
  return useContext(AuthContext);
}
