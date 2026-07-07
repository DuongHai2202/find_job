import { createContext, startTransition, useEffect, useState } from "react";

import {
  login as loginRequest,
  loginWithGoogle as loginWithGoogleRequest,
  register as registerRequest,
} from "@/api/authApi";
import {
  clearStoredSession,
  getStoredAccessToken,
  getStoredUser,
  setStoredSession,
} from "@/lib/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => ({
    accessToken: getStoredAccessToken(),
    user: getStoredUser(),
    ready: true,
  }));

  useEffect(() => {
    function handleStorage() {
      startTransition(() => {
        setAuthState({
          accessToken: getStoredAccessToken(),
          user: getStoredUser(),
          ready: true,
        });
      });
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  async function login(credentials) {
    const response = await loginRequest(credentials);
    setStoredSession(response.accessToken, response.user);
    setAuthState({
      accessToken: response.accessToken,
      user: response.user,
      ready: true,
    });
    return response;
  }

  async function loginWithGoogle(idToken) {
    const response = await loginWithGoogleRequest(idToken);
    setStoredSession(response.accessToken, response.user);
    setAuthState({
      accessToken: response.accessToken,
      user: response.user,
      ready: true,
    });
    return response;
  }

  async function register(payload) {
    const response = await registerRequest(payload);
    setStoredSession(response.accessToken, response.user);
    setAuthState({
      accessToken: response.accessToken,
      user: response.user,
      ready: true,
    });
    return response;
  }

  function logout() {
    clearStoredSession();
    setAuthState({
      accessToken: null,
      user: null,
      ready: true,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        isAuthenticated: Boolean(authState.accessToken && authState.user),
        login,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
