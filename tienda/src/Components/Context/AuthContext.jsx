import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuthenticatedUserId = (id) => {
    setUserId(id);
    setIsAuthenticated(!!id);
  };

  return (
    <AuthContext.Provider value={{ userId, setAuthenticatedUserId, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};