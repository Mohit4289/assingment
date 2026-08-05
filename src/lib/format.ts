export function heightToMeters(heightCm: string): string {
  const cm = Number(heightCm);
  if (!Number.isFinite(cm)) return "Unknown";
  return `${(cm / 100).toFixed(2)} m`;
}

export function massToKg(mass: string): string {
  const kg = Number(mass.replace(/,/g, ""));
  if (!Number.isFinite(kg)) return "Unknown";
  return `${kg.toLocaleString()} kg`;
}

export function formatDateDDMMYYYY(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function displayBirthYear(birthYear: string): string {
  return birthYear === "unknown" ? "Unknown" : birthYear;
}

export function idFromUrl(url: string): string {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? match[1] : url;
}
