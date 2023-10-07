import { useAuthContext } from "./useAuthContext";
import { SERVER_CODE } from "../config/Enum";
import { useState } from "react";
import { fetchData } from "../config/Api";

export const useLogout = () => {
  const { user, authActions } = useAuthContext();
  const [error, setError] = useState(null);

  const logout = async () => {
    const response = await fetchData("/user/logout", "POST", {}, user.token);
    if (response[1] !== SERVER_CODE.OK) {
      setError(response[2]);
    } else {
      await authActions.logout();
    }
  };
  return { logout };
};
