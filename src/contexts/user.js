import React, { useContext, createContext, useState, useEffect } from "react";
import { useAuthContext } from "./auth";
import { userApi } from "../API/userApi";

// Create a context for user data
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, userReset } = useAuthContext();
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    if (user) {
      const data = await userApi.getUser(user.id);
      setUserData(data);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userReset]);

  return (
    <UserContext.Provider value={{ userData }}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
