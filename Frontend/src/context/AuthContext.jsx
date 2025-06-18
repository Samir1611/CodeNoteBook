import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setAuthToken("authenticated"); // Placeholder token
    setUser(userData);
    setLoading(false);
  };
  const API_BASE = "https://codenotebook-backend.onrender.com";

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          setUser(null);
          return;
        }

        const json = await res.json();
        if (json.success) {
          setUser(json.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
