import React, { createContext, useState, useContext } from "react";

const DropAreaContext = createContext();

export const DropAreaProvider = ({ children }) => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  return (
    <DropAreaContext.Provider value={{ selectedFiles, setSelectedFiles }}>
      {children}
    </DropAreaContext.Provider>
  );
};

export const useFileContext = () => useContext(DropAreaContext);
