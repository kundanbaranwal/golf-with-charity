/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken } from "@/lib/auth";

const API_BASE =
  ((import.meta as ImportMeta & { env?: Record<string, string> }).env
    ?.VITE_API_URL as string | undefined) || "http://localhost:5000/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token = options.token ?? getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      (data as { message?: string } | null)?.message || "Request failed";
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: payload,
    }),

  signup: (payload: {
    name: string;
    email: string;
    password: string;
    charity_id?: number | null;
    charity_percentage?: number;
  }) =>
    request<{ message: string; userId: number }>("/auth/signup", {
      method: "POST",
      body: payload,
    }),

  me: () => request<any>("/auth/me"),

  getCharities: () => request<any[]>("/charities"),

  getScores: () => request<any[]>("/scores"),
  addScore: (payload: { score: number; date: string }) =>
    request<{ message: string }>("/scores", { method: "POST", body: payload }),

  getSubscription: () => request<any>("/subscription/me"),
  createSubscription: (payload: {
    planType: "monthly" | "yearly";
    paymentGateway?: string;
  }) => request<any>("/subscription/create", { method: "POST", body: payload }),

  getLatestDraw: () => request<any>("/draw/latest"),
  runDraw: () => request<any>("/draw/run", { method: "POST" }),

  getMyWinners: () => request<any[]>("/winners/me"),
  getPendingWinners: () => request<any[]>("/winners/pending"),
  updateWinnerStatus: (
    id: number,
    payload: { status: "pending" | "paid"; prize_amount?: number | null },
  ) =>
    request<{ message: string }>(`/winners/${id}/status`, {
      method: "PATCH",
      body: payload,
    }),

  addCharity: (payload: {
    name: string;
    description?: string;
    image_url?: string;
  }) =>
    request<{ message: string }>("/charities", {
      method: "POST",
      body: payload,
    }),

  adminGetUsers: () => request<any[]>("/admin/users"),
  adminSetUserBlocked: (id: number, blocked: boolean) =>
    request<{ message: string }>(`/admin/users/${id}/block`, {
      method: "PATCH",
      body: { blocked },
    }),
  adminSetUserSubscription: (
    id: number,
    payload: { status: "active" | "inactive"; plan: "monthly" | "yearly" },
  ) =>
    request<{ message: string }>(`/admin/users/${id}/subscription`, {
      method: "PATCH",
      body: payload,
    }),
};
