import type { CategoryFilters, Film, Planet, Species } from "@/types/swapi";

interface SearchFilterBarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  filters: CategoryFilters;
  onFilterChange: (key: keyof CategoryFilters, value: string | null) => void;
  planets: Planet[];
  films: Film[];
  species: Species[];
  onClear: () => void;
}

function sortedByName<T extends { name: string; url: string }>(items: T[]) {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
}

export function SearchFilterBar({
  searchInput,
  onSearchChange,
  filters,
  onFilterChange,
  planets,
  films,
  species,
  onClear,
}: SearchFilterBarProps) {
  const hasActive =
    Boolean(searchInput) || Boolean(filters.homeworld || filters.film || filters.species);

  const selectClass =
    "w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 focus:border-amber-400 focus:outline-none";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex-1">
        <label htmlFor="character-search" className="mb-1 block text-xs font-medium text-slate-400">
          Search by name
        </label>
        <input
          id="character-search"
          type="search"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="e.g. Skywalker"
          className={selectClass}
        />
      </div>

      <div className="flex-1">
        <label htmlFor="filter-homeworld" className="mb-1 block text-xs font-medium text-slate-400">
          Homeworld
        </label>
        <select
          id="filter-homeworld"
          value={filters.homeworld ?? ""}
          onChange={(e) => onFilterChange("homeworld", e.target.value || null)}
          className={selectClass}
        >
          <option value="">All homeworlds</option>
          {sortedByName(planets).map((planet) => (
            <option key={planet.url} value={planet.url}>
              {planet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="filter-film" className="mb-1 block text-xs font-medium text-slate-400">
          Film
        </label>
        <select
          id="filter-film"
          value={filters.film ?? ""}
          onChange={(e) => onFilterChange("film", e.target.value || null)}
          className={selectClass}
        >
          <option value="">All films</option>
          {films
            .slice()
            .sort((a, b) => a.episode_id - b.episode_id)
            .map((film) => (
              <option key={film.url} value={film.url}>
                {film.title}
              </option>
            ))}
        </select>
      </div>

      <div className="flex-1">
        <label htmlFor="filter-species" className="mb-1 block text-xs font-medium text-slate-400">
          Species
        </label>
        <select
          id="filter-species"
          value={filters.species ?? ""}
          onChange={(e) => onFilterChange("species", e.target.value || null)}
          className={selectClass}
        >
          <option value="">All species</option>
          {sortedByName(species).map((s) => (
            <option key={s.url} value={s.url}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {hasActive && (
        <button
          type="button"
          onClick={onClear}
          className="whitespace-nowrap rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
