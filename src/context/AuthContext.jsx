import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode  } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token); // Используем `decode` вместо `jwt_decode`
      setRole(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decodedToken = jwtDecode(token); // Используем `decode`
    setRole(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
