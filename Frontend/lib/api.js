const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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
