import { createContext, useReducer } from "react";
import { LOCAL_STORAGE } from "../config/Enum";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "RESTORE":
      return { ...state, user: action.payload, isRestoreFinished: true }
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isRestoreFinished: false,
  });

  const authActions = {
    login: (user) => {
      dispatch({ type: "LOGIN", payload: user })
      localStorage.setItem(LOCAL_STORAGE.USER, JSON.stringify(user));
    },
    logout: () => {
      dispatch({ type: "LOGOUT" })
      localStorage.removeItem(LOCAL_STORAGE.USER);
    },
    restore: () => {
      const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER));
      if (user) {
        dispatch({ type: "RESTORE", payload: user });
      } else {
        dispatch({ type: "RESTORE", payload: null });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, authActions }}>
      {children}
    </AuthContext.Provider>
  );
};
