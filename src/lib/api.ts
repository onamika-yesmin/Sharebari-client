import { rentalItems, type RentalItem } from "@/lib/data";

export type ApiPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type DashboardStats = {
  totalListedItems: number;
  availableItems: number;
  rentedItems: number;
  averageDailyPrice: number;
  byCategory?: Array<{ _id: string; count: number }>;
  byAvailability?: Array<{ _id: string; count: number }>;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

function normalizeItem(item: Partial<RentalItem> & Record<string, unknown>): RentalItem {
  const owner = item.owner && typeof item.owner === "object" ? item.owner as RentalItem["owner"] : undefined;

  return {
    id: String(item.slug || item._id || item.id || ""),
    _id: item._id ? String(item._id) : undefined,
    slug: item.slug ? String(item.slug) : undefined,
    title: String(item.title || "Untitled item"),
    shortDescription: String(item.shortDescription || ""),
    fullDescription: String(item.fullDescription || item.shortDescription || ""),
    category: item.category as RentalItem["category"],
    dailyPrice: Number(item.dailyPrice || 0),
    securityDeposit: Number(item.securityDeposit || 0),
    location: String(item.location || "Bangladesh"),
    condition: item.condition as RentalItem["condition"],
    availability: item.availability as RentalItem["availability"],
    brand: String(item.brand || "Not specified"),
    model: String(item.model || "Not specified"),
    minimumRentalDays: Number(item.minimumRentalDays || 1),
    images: Array.isArray(item.images) && item.images.length > 0 ? item.images.map(String) : ["/window.svg"],
    rating: Number(item.rating || 0),
    featured: Boolean(item.featured),
    owner: {
      name: owner?.name || "ShareBari owner",
      location: owner?.location || String(item.location || "Bangladesh"),
      phone: owner?.phone || "",
      email: owner?.email || "",
    },
  };
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(payload.message || "Request failed", response.status);
  }

  return payload as T;
}

export async function getItems(query = "") {
  try {
    const payload = await apiFetch<{ data: Array<Record<string, unknown>>; pagination: ApiPagination }>(`/api/items${query}`);
    return {
      items: payload.data.map(normalizeItem),
      pagination: payload.pagination,
      source: "api" as const,
    };
  } catch {
    return {
      items: rentalItems,
      pagination: { page: 1, limit: 12, total: rentalItems.length, totalPages: 1 },
      source: "fallback" as const,
    };
  }
}

export async function getFeaturedItems() {
  try {
    const payload = await apiFetch<{ data: Array<Record<string, unknown>> }>("/api/items/featured");
    return payload.data.map(normalizeItem);
  } catch {
    return rentalItems.filter((item) => item.featured).slice(0, 4);
  }
}

export async function getRecentItems() {
  try {
    const payload = await apiFetch<{ data: Array<Record<string, unknown>> }>("/api/items/recent");
    return payload.data.map(normalizeItem);
  } catch {
    return rentalItems.slice(-4).reverse();
  }
}

export async function getItemById(id: string) {
  try {
    const payload = await apiFetch<{ data: Record<string, unknown> }>(`/api/items/${id}`);
    return normalizeItem(payload.data);
  } catch {
    return rentalItems.find((item) => item.id === id);
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const payload = await apiFetch<{ data: DashboardStats }>("/api/dashboard/stats");
  return payload.data;
}

export async function apiPost<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T>(path: string) {
  return apiFetch<T>(path, { method: "DELETE" });
}
