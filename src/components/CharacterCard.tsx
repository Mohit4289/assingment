"use client";

import { useState } from "react";
import { idFromUrl } from "@/lib/format";
import { randomPortraitUrl, themeForSpecies } from "@/lib/species-color";
import type { Person } from "@/types/swapi";

interface CharacterCardProps {
  person: Person;
  speciesName: string;
  onOpen: () => void;
}

export function CharacterCard({ person, speciesName, onOpen }: CharacterCardProps) {
  const [portraitUrl] = useState(() => randomPortraitUrl(idFromUrl(person.url)));
  const theme = themeForSpecies(speciesName);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br ${theme.gradient} p-1 text-left shadow-lg shadow-black/30 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl focus:outline-none focus-visible:ring-4 ${theme.ring}`}
    >
      <div className="overflow-hidden rounded-xl bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portraitUrl}
          alt={person.name}
          className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-3 py-3">
        <h3 className="truncate text-base font-semibold text-white">{person.name}</h3>
        <span
          className={`inline-flex w-fit items-center rounded-full ${theme.badge} px-2 py-0.5 text-xs font-medium text-white/90`}
        >
          {speciesName}
        </span>
      </div>
    </button>
  );
}
