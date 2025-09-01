import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    admin: JSON.parse(localStorage.getItem("admin")) || null,
  });

  // Decode token and check expiry
  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  };

  // Determine default route based on permissions
  const getDefaultRoute = (admin) => {
    if (!admin || !admin.permissions) return "/unauthorized";

    const perms = admin.permissions;

    if (perms.admins) return "/admins";
    if (perms.colleges) return "/colleges";
    if (perms.courses) return "/courses";
    if (perms.questions?.coding) return "/questions/coding";
    if (perms.questions?.mcq) return "/questions/mcq";
    if (perms.questions?.rearrange) return "/questions/rearrange";

    return "/unauthorized";
  };

  const login = (token, admin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(admin));
    setAuth({ token, admin });

    const defaultRoute = getDefaultRoute(admin);
    navigate(defaultRoute);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setAuth({ token: null, admin: null });
    navigate("/login");
  };

  const hasPermission = (permissionPath) => {
    if (!auth.admin || !auth.admin.permissions) return false;

    let perms = auth.admin.permissions;
    const keys = permissionPath.split(".");

    for (let key of keys) {
      if (!perms[key]) return false;
      perms = perms[key];
    }
    return true;
  };

  // Auto logout if token expired
  useEffect(() => {
    if (auth.token && !isTokenValid(auth.token)) {
      logout();
    }
  }, [auth.token]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        hasPermission,
        isTokenValid,
        getDefaultRoute, // added here so other components can use it
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
