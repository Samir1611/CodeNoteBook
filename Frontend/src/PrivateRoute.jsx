// PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
const PrivateRoute = ({ children }) => {
  const { authToken, user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  return authToken && user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
