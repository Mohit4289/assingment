"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { validateCredentials } from "./credentials";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_BUFFER_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  createMockToken,
  decodeToken,
  isExpired,
} from "./token";

const ACCESS_KEY = "sw_access_token";
const REFRESH_KEY = "sw_refresh_token";

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  username: string | null;
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  lastRefreshedAt: number | null;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

type ScheduleRefreshFn = (username: string, refreshToken: string, accessExp: number) => void;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "checking",
    username: null,
    accessToken: null,
    accessTokenExpiresAt: null,
    lastRefreshedAt: null,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleRefreshRef = useRef<ScheduleRefreshFn>(() => {});

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearTimer();
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setState({
      status: "unauthenticated",
      username: null,
      accessToken: null,
      accessTokenExpiresAt: null,
      lastRefreshedAt: null,
    });
  }, [clearTimer]);

  // Recurses via a ref (not a direct self-closure) so this stays a plain,
  // statically-analyzable useCallback instead of a self-referential one.
  const scheduleRefresh = useCallback<ScheduleRefreshFn>(
    (username, refreshToken, accessExp) => {
      clearTimer();
      const delayMs = Math.max(
        (accessExp - Math.floor(Date.now() / 1000) - REFRESH_BUFFER_SECONDS) * 1000,
        0
      );
      timerRef.current = setTimeout(() => {
        if (isExpired(refreshToken)) {
          logout();
          return;
        }
        const newAccess = createMockToken(username, "access", ACCESS_TOKEN_TTL_SECONDS);
        localStorage.setItem(ACCESS_KEY, newAccess);
        const payload = decodeToken(newAccess)!;
        setState((prev) => ({
          ...prev,
          accessToken: newAccess,
          accessTokenExpiresAt: payload.exp,
          lastRefreshedAt: Date.now(),
        }));
        scheduleRefreshRef.current(username, refreshToken, payload.exp);
      }, delayMs);
    },
    [clearTimer, logout]
  );

  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh;
  }, [scheduleRefresh]);

  const login = useCallback(
    (username: string, password: string) => {
      if (!validateCredentials(username, password)) {
        return { ok: false, error: "Invalid username or password." };
      }
      const accessToken = createMockToken(username, "access", ACCESS_TOKEN_TTL_SECONDS);
      const refreshToken = createMockToken(username, "refresh", REFRESH_TOKEN_TTL_SECONDS);
      localStorage.setItem(ACCESS_KEY, accessToken);
      localStorage.setItem(REFRESH_KEY, refreshToken);
      const payload = decodeToken(accessToken)!;
      setState({
        status: "authenticated",
        username,
        accessToken,
        accessTokenExpiresAt: payload.exp,
        lastRefreshedAt: null,
      });
      scheduleRefresh(username, refreshToken, payload.exp);
      return { ok: true };
    },
    [scheduleRefresh]
  );

  // Restoring a session from localStorage is inherently a one-time,
  // client-only bootstrap — it can't be derived during render because
  // localStorage isn't available on the server, so a mount effect (with
  // setState resolving the initial "checking" status) is the correct tool.
  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_KEY);
    const refreshToken = localStorage.getItem(REFRESH_KEY);

    if (!refreshToken || isExpired(refreshToken)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      logout();
      return;
    }

    const refreshPayload = decodeToken(refreshToken)!;
    const username = refreshPayload.sub;

    if (accessToken && !isExpired(accessToken)) {
      const accessPayload = decodeToken(accessToken)!;
      setState({
        status: "authenticated",
        username,
        accessToken,
        accessTokenExpiresAt: accessPayload.exp,
        lastRefreshedAt: null,
      });
      scheduleRefresh(username, refreshToken, accessPayload.exp);
      return;
    }

    const newAccess = createMockToken(username, "access", ACCESS_TOKEN_TTL_SECONDS);
    localStorage.setItem(ACCESS_KEY, newAccess);
    const newPayload = decodeToken(newAccess)!;
    setState({
      status: "authenticated",
      username,
      accessToken: newAccess,
      accessTokenExpiresAt: newPayload.exp,
      lastRefreshedAt: Date.now(),
    });
    scheduleRefresh(username, refreshToken, newPayload.exp);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
