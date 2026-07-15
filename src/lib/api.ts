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

export type UserRole = "user" | "admin";

export type CurrentUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  authProvider?: "local" | "google";
  role?: UserRole | string;
  avatar?: string;
  createdAt?: string;
};

export type AdminUser = CurrentUser & {
  listedItems: number;
};

export type AdminUsersSummary = {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  totalItems: number;
  totalPayments: number;
};

export type RentalRequestStatus = "pending" | "accepted" | "rejected" | "cancelled" | "paid";

export type RentalRequest = {
  _id: string;
  item: {
    _id?: string;
    title?: string;
    slug?: string;
    images?: string[];
    location?: string;
    category?: string;
    availability?: string;
  };
  renter?: CurrentUser;
  owner?: CurrentUser;
  rentalDays: number;
  dailyPrice: number;
  securityDeposit: number;
  rentalAmount: number;
  totalAmount: number;
  status: RentalRequestStatus;
  renterMessage?: string;
  ownerNote?: string;
  createdAt?: string;
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
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:5000"
    : "";

function getStoredAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("sharebari_auth_token");
}

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
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getStoredAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("sharebari_authenticated");
      window.localStorage.removeItem("sharebari_auth_token");
    }
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

export async function getMyItems() {
  const payload = await apiFetch<{ data: Array<Record<string, unknown>> }>("/api/items/my-items");
  return payload.data.map(normalizeItem);
}

export async function updateRentalItem(id: string, body: Partial<RentalItem>) {
  const payload = await apiPatch<{ data: Record<string, unknown> }>(`/api/items/${id}`, body);
  return normalizeItem(payload.data);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const payload = await apiFetch<{ data: CurrentUser }>("/api/auth/me");
  return payload.data;
}

export async function getAdminUsers() {
  const payload = await apiFetch<{ data: AdminUser[]; summary: AdminUsersSummary }>("/api/admin/users");
  return payload;
}

export async function createRentalRequest(body: { itemId: string; rentalDays: number; renterMessage?: string }) {
  const payload = await apiPost<{ data: RentalRequest }>("/api/rental-requests", body);
  return payload.data;
}

export async function getMyRentalRequests() {
  const payload = await apiFetch<{ data: RentalRequest[] }>("/api/rental-requests/my");
  return payload.data;
}

export async function getOwnerRentalRequests() {
  const payload = await apiFetch<{ data: RentalRequest[] }>("/api/rental-requests/owner");
  return payload.data;
}

export async function updateRentalRequestStatus(id: string, body: { status: "accepted" | "rejected"; ownerNote?: string }) {
  const payload = await apiPatch<{ data: RentalRequest }>(`/api/rental-requests/${id}/status`, body);
  return payload.data;
}

export async function createCheckoutSession(body: { itemId?: string; requestId?: string; rentalDays?: number }) {
  const payload = await apiPost<{ data: { checkoutUrl: string | null } }>("/api/payments/create-checkout-session", body);
  return payload.data;
}

export async function apiPost<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiPatch<T>(path: string, body: unknown) {
  return apiFetch<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function updateCurrentUser(body: Pick<CurrentUser, "name" | "email" | "phone" | "location" | "avatar">) {
  const payload = await apiPatch<{ data: CurrentUser }>("/api/auth/me", body);
  return payload.data;
}

export async function logoutUser() {
  return apiFetch<{ message?: string }>("/api/auth/logout", { method: "POST" });
}

export async function apiDelete<T>(path: string) {
  return apiFetch<T>(path, { method: "DELETE" });
}
