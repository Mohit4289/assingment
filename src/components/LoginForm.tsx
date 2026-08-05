"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { MOCK_PASSWORD, MOCK_USERNAME } from "@/lib/auth/credentials";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(username, password);
    if (!result.ok) {
      setError(result.error ?? "Login failed.");
      return;
    }
    setError(null);
    router.replace("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="mb-1 text-2xl font-bold text-amber-400">Sign in</h1>
        <p className="mb-6 text-sm text-slate-400">
          Sign in to browse the archive. (Mock auth — use{" "}
          <code className="rounded bg-slate-800 px-1 py-0.5 text-amber-300">{MOCK_USERNAME}</code> /{" "}
          <code className="rounded bg-slate-800 px-1 py-0.5 text-amber-300">{MOCK_PASSWORD}</code>)
        </p>

        <label htmlFor="username" className="mb-1 block text-xs font-medium text-slate-400">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
        />

        <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-400">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-amber-400 focus:outline-none"
        />

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
