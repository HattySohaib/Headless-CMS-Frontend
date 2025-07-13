import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const decodedUser = JSON.parse(atob(token.split(".")[1]));
      setUser({ ...decodedUser, token: token });
    } else {
      logout();
    }
    setLoading(false); // Set loading to false once user status is determined
  }, [token]);

  const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 < Date.now();
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false); // Set loading to false after successful login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setLoading(false); // Set loading to false after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
