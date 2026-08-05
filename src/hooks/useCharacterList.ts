import { useQuery } from "@tanstack/react-query";
import { fetchAllPeople, fetchPeoplePage } from "@/lib/swapi";
import type { CategoryFilters } from "@/types/swapi";

export const PAGE_SIZE = 10;

export function hasActiveFilter(filters: CategoryFilters): boolean {
  return Boolean(filters.homeworld || filters.film || filters.species);
}

export function useCharacterList(
  page: number,
  searchTerm: string,
  filters: CategoryFilters,
  humanSpeciesUrl: string | null
) {
  const filterActive = hasActiveFilter(filters);

  const pageQuery = useQuery({
    queryKey: ["people-page", page, searchTerm],
    queryFn: () => fetchPeoplePage(page, searchTerm),
    enabled: !filterActive,
  });

  const allQuery = useQuery({
    queryKey: ["people-all", searchTerm],
    queryFn: () => fetchAllPeople(searchTerm),
    enabled: filterActive,
  });

  if (!filterActive) {
    const count = pageQuery.data?.count ?? 0;
    return {
      people: pageQuery.data?.results ?? [],
      totalCount: count,
      totalPages: Math.max(Math.ceil(count / PAGE_SIZE), 1),
      isLoading: pageQuery.isLoading,
      isFetching: pageQuery.isFetching,
      isError: pageQuery.isError,
      error: pageQuery.error,
      refetch: pageQuery.refetch,
    };
  }

  const filtered = (allQuery.data ?? []).filter((person) => {
    if (filters.homeworld && person.homeworld !== filters.homeworld) return false;
    if (filters.film && !person.films.includes(filters.film)) return false;
    if (filters.species) {
      const matchesSpecies = person.species.includes(filters.species);
      const matchesHumanDefault =
        filters.species === humanSpeciesUrl && person.species.length === 0;
      if (!matchesSpecies && !matchesHumanDefault) return false;
    }
    return true;
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);
  const start = (page - 1) * PAGE_SIZE;

  return {
    people: filtered.slice(start, start + PAGE_SIZE),
    totalCount,
    totalPages,
    isLoading: allQuery.isLoading,
    isFetching: allQuery.isFetching,
    isError: allQuery.isError,
    error: allQuery.error,
    refetch: allQuery.refetch,
  };
}
