"use client";

import { useState } from "react";
import { useCharacterList } from "@/hooks/useCharacterList";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useReferenceData } from "@/hooks/useReferenceData";
import type { CategoryFilters, Person } from "@/types/swapi";
import { CharacterCard } from "./CharacterCard";
import { CharacterModal } from "./CharacterModal";
import { ErrorState } from "./ErrorState";
import { Loader } from "./Loader";
import { Pagination } from "./Pagination";
import { SearchFilterBar } from "./SearchFilterBar";

const EMPTY_FILTERS: CategoryFilters = { homeworld: null, film: null, species: null };

export function CharacterGrid() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<CategoryFilters>(EMPTY_FILTERS);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const searchTerm = useDebouncedValue(searchInput, 350);
  const reference = useReferenceData();
  const list = useCharacterList(page, searchTerm, filters, reference.humanSpeciesUrl);

  const queryKey = `${searchTerm}|${filters.homeworld}|${filters.film}|${filters.species}`;
  const [lastQueryKey, setLastQueryKey] = useState(queryKey);
  if (queryKey !== lastQueryKey) {
    setLastQueryKey(queryKey);
    setPage(1);
  }

  function speciesNameFor(person: Person): string {
    if (person.species.length === 0) return "Human";
    return reference.speciesMap.get(person.species[0])?.name ?? "Unknown";
  }

  if (reference.isError) {
    return (
      <ErrorState
        message="Couldn't load reference data (planets, films, species) from the Star Wars API."
        onRetry={reference.refetchAll}
      />
    );
  }

  if (reference.isLoading) {
    return <Loader label="Loading the galaxy far, far away..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      <SearchFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        filters={filters}
        onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        planets={reference.planets}
        films={reference.films}
        species={reference.species}
        onClear={() => {
          setSearchInput("");
          setFilters(EMPTY_FILTERS);
        }}
      />

      {list.isError ? (
        <ErrorState
          message={
            list.error instanceof Error ? list.error.message : "Failed to load characters."
          }
          onRetry={list.refetch}
        />
      ) : list.isLoading ? (
        <Loader label="Fetching characters..." />
      ) : list.people.length === 0 ? (
        <p className="py-16 text-center text-slate-400">
          No characters match your search and filters.
        </p>
      ) : (
        <>
          <div
            className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${
              list.isFetching ? "opacity-60 transition-opacity" : ""
            }`}
          >
            {list.people.map((person) => (
              <CharacterCard
                key={person.url}
                person={person}
                speciesName={speciesNameFor(person)}
                onOpen={() => setSelectedPerson(person)}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={list.totalPages}
            totalCount={list.totalCount}
            onPageChange={setPage}
          />
        </>
      )}

      {selectedPerson && (
        <CharacterModal
          person={selectedPerson}
          speciesName={speciesNameFor(selectedPerson)}
          homeworld={reference.planetsMap.get(selectedPerson.homeworld)}
          onClose={() => setSelectedPerson(null)}
        />
      )}
    </div>
  );
}
