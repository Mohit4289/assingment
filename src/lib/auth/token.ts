export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
  type: "access" | "refresh";
}

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded);
}

/**
 * Client-only mock JWT. There is no real backend/secret to sign against —
 * this exists purely to demo login/logout + silent refresh UX.
 */
export function createMockToken(
  sub: string,
  type: "access" | "refresh",
  ttlSeconds: number
): string {
  const header = { alg: "mock-HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = { sub, iat: now, exp: now + ttlSeconds, type };
  const headerPart = base64UrlEncode(JSON.stringify(header));
  const payloadPart = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode(`${headerPart}.${payloadPart}.mock-secret`).slice(0, 24);
  return `${headerPart}.${payloadPart}.${signature}`;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const [, payloadPart] = token.split(".");
    return JSON.parse(base64UrlDecode(payloadPart)) as TokenPayload;
  } catch {
    return null;
  }
}

export function isExpired(token: string, bufferSeconds = 0): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  return Math.floor(Date.now() / 1000) + bufferSeconds >= payload.exp;
}

export const ACCESS_TOKEN_TTL_SECONDS = 45;
export const REFRESH_TOKEN_TTL_SECONDS = 30 * 60;
export const REFRESH_BUFFER_SECONDS = 5;
