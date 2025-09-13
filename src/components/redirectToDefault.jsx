import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "./components/Auth/AuthContext";
import { useAuth } from "./Auth/AuthContext";
const RedirectToDefault = () => {
  const navigate = useNavigate();
  const { auth, getDefaultRoute } = useAuth();

  useEffect(() => {
    const defaultRoute = getDefaultRoute(auth.admin);
    navigate(defaultRoute, { replace: true });
  }, [auth, navigate, getDefaultRoute]);

  return null; // no UI, just redirect
};

export default RedirectToDefault;