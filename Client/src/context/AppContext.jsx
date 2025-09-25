// context/AppContext.js
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(); // logged-in user
  const [admin, setAdmin] = useState(null);
  const [agent, setAgent] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);

  // We don't call useNavigate here directly in context initialization
  // Instead, we provide a helper function that can be called from components
  const value = {
    user,
    setUser,
    admin,
    setAdmin,
    agent,
    setAgent,
    showUserLogin,
    setShowUserLogin,
    navigateTo: (navigateFunc, path) => {
      // Pass navigate function from component and path to navigate
      navigateFunc(path);
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
