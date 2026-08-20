import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiPost } from "../api/client";

interface AuthContextValue {
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("fitly_token")
  );

  // The browser's back/forward cache can restore a whole previous page
  // snapshot (including its in-memory logged-in state) without re-running
  // this component's mount logic. Forcing a reload on a bfcache restore
  // makes the app re-read localStorage, so a logout can't be undone by
  // clicking Back.
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        window.location.reload();
      }
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function login(email: string, password: string) {
    const res = await apiPost<{ token: string }>("/auth/login", { email, password });
    setToken(res.token);
    localStorage.setItem("fitly_token", res.token);
  }

  async function register(email: string, password: string) {
    await apiPost("/auth/register", { email, password });
    await login(email, password);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("fitly_token");
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn: token !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
