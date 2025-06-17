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

  const logout = async () => {
    await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthToken(null);
    setUser(null);
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          credentials: "include",
        });
        const json = await res.json();
        if (json.success) {
          login(json.user); // Pass user data directly
        }
      } catch (err) {
        console.error("Session verification failed:", err);
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
