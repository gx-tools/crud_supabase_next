import { createClient } from "./supabase/client";
import { tasksApi } from "@/services/api";
import { handleError } from "@/helpers/handlers";

// API-based task functions
export async function fetchApiTasks() {
  try {
    return await tasksApi.getAllTasks();
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function createApiTask(task: string) {
  try {
    return await tasksApi.createTask({ title: task });
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function updateApiTask(id: number, data: { title?: string; completed?: boolean }) {
  try {
    return await tasksApi.updateTask(id, data);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function deleteApiTask(id: number) {
  try {
    return await tasksApi.deleteTask(id);
  } catch (error) {
    handleError(error);
    throw error;
  }
} 