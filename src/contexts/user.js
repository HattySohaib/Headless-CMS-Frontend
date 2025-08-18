import React, { useContext, createContext, useState, useEffect } from "react";
import { useAuthContext } from "./auth";
import { userApi } from "../API/userApi";

// Create a context for user data
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, userReset } = useAuthContext();
  const [userData, setUserData] = useState(null);

  console.log("UserProvider initialized with user:", user);

  const fetchUserData = async () => {
    if (user) {
      const res = await userApi.getUser(user.id);
      setUserData(res.data);
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
