import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const run = async (fn, ...args) => {
    setError(null);
    try {
      return await fn(...args);
    } catch (e) {
      setError(authService.getAuthErrorMessage(e));
      throw e;
    }
  };

  const value = {
    user,
    loading,
    error,
    clearError: () => setError(null),
    signup: (email, pass) => run(authService.signup, email, pass),
    login: (email, pass) => run(authService.login, email, pass),
    loginWithGoogle: () => run(authService.loginWithGoogle),
    logout: () => run(authService.logout),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}