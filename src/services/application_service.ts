import {
  type ApplicationStatus,
  type Category,
  type Job,
  type JobCreate,
  type JobUpdate,
  type Token,
  type User,
  type UserCreate,
} from "../types/Job";

export const BASE_URL = "http://127.0.0.1:8000";

const ACCESS_TOKEN_KEY = "jwt-token";
const TOKEN_TYPE_KEY = "token-type";

export type GetApplicationsParams = {
  status?: ApplicationStatus;
  category_id?: number;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
  upload?: boolean,
): Promise<T> {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const tokenType = localStorage.getItem(TOKEN_TYPE_KEY);

  const tokenHeader: HeadersInit =
    accessToken && tokenType
      ? { Authorization: `${tokenType} ${accessToken}` }
      : {};

  const headers: HeadersInit = {
    ...(init?.body !== undefined && !upload
      ? { "Content-Type": "application/json" }
      : {}),
    ...tokenHeader,
    ...init?.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);

    throw new ApiError("Unauthorized", 401);
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const body = (await response.json()) as { detail?: string | unknown };

      if (typeof body.detail === "string") {
        message = body.detail;
      } else if (body.detail !== undefined) {
        message = JSON.stringify(body.detail);
      }
    } catch {
      // response body was not JSON
    }

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function health_check(): Promise<{ message: string }> {
  return request<{ message: string }>("/");
}

// --- Applications ---

export async function get_applications(
  params?: GetApplicationsParams,
): Promise<Job[]> {
  const searchParams = new URLSearchParams();

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.category_id !== undefined) {
    searchParams.set("category_id", String(params.category_id));
  }

  const query = searchParams.toString();

  return request<Job[]>(`/applications${query ? `?${query}` : ""}`);
}

export async function get_application(id: number): Promise<Job> {
  return request<Job>(`/applications/${id}`);
}

export async function create_application(data: JobCreate): Promise<Job> {
  return request<Job>("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function update_application(
  id: number,
  data: JobUpdate,
): Promise<Job> {
  return request<Job>(`/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function delete_application(id: number): Promise<Job> {
  return request<Job>(`/applications/${id}`, {
    method: "DELETE",
  });
}

// --- Categories ---

export async function get_categories(): Promise<Category[]> {
  return request<Category[]>("/category");
}

export async function create_category(title: string): Promise<Category> {
  return request<Category>("/category", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function delete_category(id: number): Promise<Category> {
  return request<Category>(`/category/${id}`, {
    method: "DELETE",
  });
}

// --- Uploads ---

export async function upload_logo_image(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const jsonData = await request<{ message: string }>(
    "/upload",
    {
      method: "POST",
      body: formData,
    },
    true,
  );

  return jsonData.message;
}

// --- Users ---

export async function register(user: UserCreate): Promise<User> {
  return request<User>("/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function login(user: FormData): Promise<Token> {
  const token = await request<Token>(
    "/token",
    {
      method: "POST",
      body: user,
    },
    true,
  );

  localStorage.setItem(ACCESS_TOKEN_KEY, token.access_token);
  localStorage.setItem(TOKEN_TYPE_KEY, token.token_type);

  return token;
}

export function logout() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);

  window.location.href = "/auth";
}

export async function get_user_data(): Promise<User> {
  return request<User>("/user", {
    method: "GET",
  });
}
