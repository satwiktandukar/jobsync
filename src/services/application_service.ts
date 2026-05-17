import type {
  ApplicationStatus,
  Category,
  Job,
  JobCreate,
  JobUpdate,
} from "../types/Job";

const BASE_URL = "http://127.0.0.1:8000";

export type GetApplicationsParams = {
  status?: ApplicationStatus;
  category?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    ...(init?.body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...init?.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

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

// --- Health ---

export async function health_check(): Promise<{ message: string }> {
  return request<{ message: string }>("/");
}

// --- Applications ---

export async function get_applications(
  params?: GetApplicationsParams,
): Promise<Job[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.category) searchParams.set("category", params.category);

  const query = searchParams.toString();
  return request<Job[]>(`/applications${query ? `?${query}` : ""}`);
}

/** @deprecated Prefer `get_applications({ status })` for optional filters. */
export async function get_all_applications(
  status: ApplicationStatus | null,
  category?: string,
): Promise<Job[]> {
  return get_applications({
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
  });
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

export async function create_category(id: string): Promise<Category> {
  return request<Category>("/category", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
