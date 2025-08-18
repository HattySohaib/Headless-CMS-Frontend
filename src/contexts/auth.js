import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userReset, setUserReset] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  const resetUser = useCallback(() => {
    setUserReset(!userReset);
  }, []);

  const isTokenExpired = useCallback((token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Token parsing error:", error);
      return true;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
  }, []);

  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const decodedUser = JSON.parse(atob(token.split(".")[1]));
      setUser({ ...decodedUser, token: token });
      resetUser();
    } else {
      logout();
    }
    setIsLoading(false);
  }, [token, isTokenExpired, resetUser, logout]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setTimeout(() => setUserReset(!userReset), 1000);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, userReset, resetUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
