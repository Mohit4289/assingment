import type { Film, Paginated, Person, Planet, Species } from "@/types/swapi";

export const SWAPI_BASE =
  process.env.NEXT_PUBLIC_SWAPI_BASE_URL ?? "https://swapi.py4e.com/api";

class SwapiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "SwapiError";
  }
}

async function request<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  } catch {
    throw new SwapiError(
      "Couldn't reach the Star Wars API. Check your connection and try again."
    );
  }
  if (!res.ok) {
    throw new SwapiError(
      `The Star Wars API responded with an error (${res.status}).`,
      res.status
    );
  }
  return res.json() as Promise<T>;
}

export function fetchPeoplePage(
  page: number,
  search?: string
): Promise<Paginated<Person>> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  return request<Paginated<Person>>(`${SWAPI_BASE}/people/?${params}`);
}

async function fetchAllPages<T>(startUrl: string): Promise<T[]> {
  const all: T[] = [];
  let url: string | null = startUrl;
  while (url) {
    const page: Paginated<T> = await request<Paginated<T>>(url);
    all.push(...page.results);
    url = page.next;
  }
  return all;
}

export function fetchAllPeople(search?: string): Promise<Person[]> {
  const params = new URLSearchParams({ page: "1" });
  if (search) params.set("search", search);
  return fetchAllPages<Person>(`${SWAPI_BASE}/people/?${params}`);
}

export function fetchAllPlanets(): Promise<Planet[]> {
  return fetchAllPages<Planet>(`${SWAPI_BASE}/planets/?page=1`);
}

export function fetchAllFilms(): Promise<Film[]> {
  return fetchAllPages<Film>(`${SWAPI_BASE}/films/?page=1`);
}

export function fetchAllSpecies(): Promise<Species[]> {
  return fetchAllPages<Species>(`${SWAPI_BASE}/species/?page=1`);
}

export function fetchByUrl<T>(url: string): Promise<T> {
  return request<T>(url);
}

export { SwapiError };
