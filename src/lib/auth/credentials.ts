export const MOCK_USERNAME = "admin";
export const MOCK_PASSWORD = "starwars123";

export function validateCredentials(username: string, password: string): boolean {
  return username === MOCK_USERNAME && password === MOCK_PASSWORD;
}
