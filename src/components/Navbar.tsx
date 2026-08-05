"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export function Navbar() {
  const { status, username, accessTokenExpiresAt, lastRefreshedAt, logout } = useAuth();
  const router = useRouter();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const secondsLeft =
    accessTokenExpiresAt && now
      ? Math.max(accessTokenExpiresAt - Math.floor(now / 1000), 0)
      : null;
  const showRefreshToast =
    lastRefreshedAt !== null && now !== null && now - lastRefreshedAt < 3000;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <h1 className="text-lg font-bold tracking-tight text-amber-400">
          Star Wars Characters
        </h1>

        {status === "authenticated" && (
          <div className="flex items-center gap-4">
            {showRefreshToast && (
              <span className="hidden rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 sm:inline">
                Session refreshed silently
              </span>
            )}
            {secondsLeft !== null && (
              <span
                className="hidden text-xs text-slate-500 sm:inline"
                title="Mock access token expires in"
              >
                Token expires in {secondsLeft}s
              </span>
            )}
            <span className="text-sm text-slate-300">{username}</span>
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
