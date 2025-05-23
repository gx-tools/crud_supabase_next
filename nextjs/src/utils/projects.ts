import { createClient } from "./supabase/client";
import { projectsApi } from "@/services/api";
import { handleError } from "@/helpers/handlers";

// API-based project functions
export async function fetchApiProjects() {
  try {
    return await projectsApi.getAllProjects();
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function createApiProject(title: string) {
  try {
    return await projectsApi.createProject({ title });
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function updateApiProject(id: string, data: { title: string }) {
  try {
    return await projectsApi.updateProject(id, data);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function deleteApiProject(id: string) {
  try {
    return await projectsApi.deleteProject(id);
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getApiProjectById(id: string) {
  try {
    return await projectsApi.getProjectById(id);
  } catch (error) {
    handleError(error);
    throw error;
  }
} 