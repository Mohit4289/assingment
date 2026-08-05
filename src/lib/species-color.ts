export interface SpeciesTheme {
  gradient: string;
  ring: string;
  badge: string;
}

const PALETTE: SpeciesTheme[] = [
  { gradient: "from-sky-500/80 to-sky-700/80", ring: "ring-sky-400", badge: "bg-sky-500/90" },
  { gradient: "from-emerald-500/80 to-emerald-700/80", ring: "ring-emerald-400", badge: "bg-emerald-500/90" },
  { gradient: "from-amber-500/80 to-amber-700/80", ring: "ring-amber-400", badge: "bg-amber-500/90" },
  { gradient: "from-rose-500/80 to-rose-700/80", ring: "ring-rose-400", badge: "bg-rose-500/90" },
  { gradient: "from-violet-500/80 to-violet-700/80", ring: "ring-violet-400", badge: "bg-violet-500/90" },
  { gradient: "from-teal-500/80 to-teal-700/80", ring: "ring-teal-400", badge: "bg-teal-500/90" },
  { gradient: "from-orange-500/80 to-orange-700/80", ring: "ring-orange-400", badge: "bg-orange-500/90" },
  { gradient: "from-fuchsia-500/80 to-fuchsia-700/80", ring: "ring-fuchsia-400", badge: "bg-fuchsia-500/90" },
  { gradient: "from-lime-500/80 to-lime-700/80", ring: "ring-lime-400", badge: "bg-lime-500/90" },
  { gradient: "from-cyan-500/80 to-cyan-700/80", ring: "ring-cyan-400", badge: "bg-cyan-500/90" },
];

const HUMAN_THEME: SpeciesTheme = {
  gradient: "from-blue-600/80 to-indigo-700/80",
  ring: "ring-blue-400",
  badge: "bg-blue-600/90",
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function themeForSpecies(speciesName: string): SpeciesTheme {
  if (speciesName === "Human") return HUMAN_THEME;
  return PALETTE[hashString(speciesName) % PALETTE.length];
}

export function randomPortraitUrl(seedBase: string): string {
  const nonce = Math.floor(Math.random() * 1_000_000);
  return `https://picsum.photos/seed/${encodeURIComponent(seedBase)}-${nonce}/400/400`;
}
