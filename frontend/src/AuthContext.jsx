import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, firebaseEnabled } from "./firebase";

const AuthContext = createContext(null);
const LOCAL_USER_KEY = "sephiq_local_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!firebaseEnabled) {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      setUser(saved ? JSON.parse(saved) : null);
      setReady(true);
      return;
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
    });
  }, []);

  const localLogin = async (email) => {
    const next = {
      uid: `local-${btoa(email).replace(/[^a-z0-9]/gi, "")}`,
      email,
      displayName: email.split("@")[0],
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(next));
    setUser(next);
  };

  const localSignup = localLogin;
  const localLogout = async () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      firebaseEnabled,
      login: (email, password) =>
        firebaseEnabled
          ? signInWithEmailAndPassword(auth, email, password)
          : localLogin(email, password),
      signup: (email, password) =>
        firebaseEnabled
          ? createUserWithEmailAndPassword(auth, email, password)
          : localSignup(email, password),
      logout: () => (firebaseEnabled ? signOut(auth) : localLogout()),
    }),
    [user, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
