"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CharacterGrid } from "@/components/CharacterGrid";
import { Loader } from "@/components/Loader";
import { useAuth } from "@/lib/auth/AuthContext";

export default function HomePage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return <Loader label="Checking session..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <CharacterGrid />
    </div>
  );
}
