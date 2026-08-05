"use client";

import { useEffect, useRef } from "react";
import {
  displayBirthYear,
  formatDateDDMMYYYY,
  heightToMeters,
  massToKg,
} from "@/lib/format";
import type { Person, Planet } from "@/types/swapi";

interface CharacterModalProps {
  person: Person;
  speciesName: string;
  homeworld: Planet | undefined;
  onClose: () => void;
}

function formatPopulation(population: string): string {
  if (population === "unknown") return "Unknown";
  const num = Number(population);
  return Number.isFinite(num) ? num.toLocaleString() : "Unknown";
}

export function CharacterModal({ person, speciesName, homeworld, onClose }: CharacterModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const stats: Array<[string, string]> = [
    ["Height", heightToMeters(person.height)],
    ["Mass", massToKg(person.mass)],
    ["Birth year", displayBirthYear(person.birth_year)],
    ["Films", String(person.films.length)],
    ["Added to API", formatDateDDMMYYYY(person.created)],
    ["Species", speciesName],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="character-modal-title"
        className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-800 px-6 py-4">
          <h2 id="character-modal-title" className="text-xl font-bold text-white">
            {person.name}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 px-6 py-5">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
              <dd className="text-sm font-medium text-slate-100">{value}</dd>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 px-6 py-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-400">
            Homeworld
          </h3>
          {homeworld ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Name</dt>
                <dd className="text-sm font-medium text-slate-100">{homeworld.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Climate</dt>
                <dd className="text-sm font-medium text-slate-100">{homeworld.climate}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Terrain</dt>
                <dd className="text-sm font-medium text-slate-100">{homeworld.terrain}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Residents</dt>
                <dd className="text-sm font-medium text-slate-100">
                  {formatPopulation(homeworld.population)}
                </dd>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Homeworld data unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}
