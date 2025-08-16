import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userReset, setUserReset] = useState(false);
  const token = localStorage.getItem("token");

  const resetUser = () => {
    setUserReset(!userReset);
  };

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const decodedUser = JSON.parse(atob(token.split(".")[1]));
      setUser({ ...decodedUser, token: token });
      resetUser();
    } else {
      logout();
    }
  }, [token]);

  const isTokenExpired = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    resetUser();
    return decoded.exp * 1000 < Date.now();
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setTimeout(() => setUserReset(!userReset), 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, userReset, resetUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
