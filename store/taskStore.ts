import { create } from "zustand";
import type { Task } from "@/lib/api";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    skip: number;
    take: number;
    total: number;
  };
  notification: {
    type: "success" | "error" | null;
    message: string;
  };

  // Actions
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (skip: number, total: number, take: number) => void;
  setNotification: (type: "success" | "error" | null, message: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  resetNotification: () => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  pagination: {
    skip: 0,
    take: 10,
    total: 0,
  },
  notification: {
    type: null,
    message: "",
  },

  setTasks: (tasks) => set({ tasks }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setPagination: (skip, total, take) =>
    set({ pagination: { skip, total, take } }),
  setNotification: (type, message) => set({ notification: { type, message } }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  resetNotification: () => set({ notification: { type: null, message: "" } }),
}));
