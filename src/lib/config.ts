// API base for the student endpoints. Baked at build time (Dockerfile passes VITE_API_BASE_URL);
// falls back to the production API.
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || "https://api.staydy.uz/api/v1";
