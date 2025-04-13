import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const username = localStorage.getItem("username");
  return username ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
