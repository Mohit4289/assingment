import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchAllFilms, fetchAllPlanets, fetchAllSpecies } from "@/lib/swapi";
import type { Film, Planet, Species } from "@/types/swapi";

export function useReferenceData() {
  const planetsQuery = useQuery({
    queryKey: ["planets-all"],
    queryFn: fetchAllPlanets,
    staleTime: Infinity,
  });
  const filmsQuery = useQuery({
    queryKey: ["films-all"],
    queryFn: fetchAllFilms,
    staleTime: Infinity,
  });
  const speciesQuery = useQuery({
    queryKey: ["species-all"],
    queryFn: fetchAllSpecies,
    staleTime: Infinity,
  });

  const planetsMap = useMemo(
    () => new Map<string, Planet>(planetsQuery.data?.map((p) => [p.url, p])),
    [planetsQuery.data]
  );
  const filmsMap = useMemo(
    () => new Map<string, Film>(filmsQuery.data?.map((f) => [f.url, f])),
    [filmsQuery.data]
  );
  const speciesMap = useMemo(
    () => new Map<string, Species>(speciesQuery.data?.map((s) => [s.url, s])),
    [speciesQuery.data]
  );

  const humanSpeciesUrl = useMemo(
    () => speciesQuery.data?.find((s) => s.name === "Human")?.url ?? null,
    [speciesQuery.data]
  );

  const isLoading =
    planetsQuery.isLoading || filmsQuery.isLoading || speciesQuery.isLoading;
  const isError = planetsQuery.isError || filmsQuery.isError || speciesQuery.isError;

  const refetchAll = () => {
    planetsQuery.refetch();
    filmsQuery.refetch();
    speciesQuery.refetch();
  };

  return {
    planets: planetsQuery.data ?? [],
    films: filmsQuery.data ?? [],
    species: speciesQuery.data ?? [],
    planetsMap,
    filmsMap,
    speciesMap,
    humanSpeciesUrl,
    isLoading,
    isError,
    refetchAll,
  };
}
