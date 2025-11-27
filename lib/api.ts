import type { CreateTaskInput, UpdateTaskInput } from "./schemas";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

export const taskApi = {
  getTasks: async (skip = 0, take = 10) => {
    return apiCall<{
      data: Task[];
      pagination: { total: number; skip: number; take: number };
    }>(`/api/tasks?skip=${skip}&take=${take}`);
  },

  getTask: async (id: string) => {
    return apiCall<Task>(`/api/tasks/${id}`);
  },

  createTask: async (data: CreateTaskInput) => {
    return apiCall<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateTask: async (id: string, data: UpdateTaskInput) => {
    return apiCall<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteTask: async (id: string) => {
    return apiCall<{ message: string }>(`/api/tasks/${id}`, {
      method: "DELETE",
    });
  },
};
