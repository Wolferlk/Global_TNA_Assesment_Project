const API_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000");

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_URL}${cleanPath}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Request failed");
  }

  if (response.status === 204) return null;
  return response.json();
}

export const categories = ["Plumbing", "Electrical", "Painting", "Joinery"];
export const statuses = ["Open", "In Progress", "Closed"];

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, "");
}

export function saveAuth(auth) {
  localStorage.setItem("auth", JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem("auth");
}

export function getToken() {
  if (typeof window === "undefined") return "";

  try {
    return JSON.parse(localStorage.getItem("auth") || "{}").token || "";
  } catch {
    return "";
  }
}

export function getUser() {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("auth") || "{}").user || null;
  } catch {
    return null;
  }
}
