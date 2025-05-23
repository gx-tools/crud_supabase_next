import { getRequest, postRequest, putRequest, patchRequest, deleteRequest } from '@/helpers/handlers';
import { axiosInstance } from './fetcher';

// Authentication API endpoints
export const authApi = {
  // Register a new user
  signup: async (data: { email: string; password: string }) => {
    return await postRequest('/api/auth/signup', data);
  },

  // Login and get JWT cookie
  login: async (data: { email: string; password: string }) => {
    return await postRequest('/api/auth/login', data);
  },

  // Logout user
  logout: async () => {
    return await postRequest('/api/auth/logout', {});
  },

  // Check authentication status
  status: async () => {
    // Use local Next.js API route which properly forwards cookies
    return await getRequest('/api/auth/status');
  }
};

// Tasks API endpoints (Protected by Auth)
export const tasksApi = {
  // Get all tasks for the authenticated user
  getAllTasks: async () => {
    return await getRequest('/api/tasks');
  },

  // Create a new task
  createTask: async (data: { title: string }) => {
    return await postRequest('/api/tasks', data);
  },

  // Get a specific task
  getTaskById: async (id: number) => {
    return await getRequest(`/api/tasks/${id}`);
  },

  // Update a task
  updateTask: async (id: number, data: { tasks?: string; completed?: boolean }) => {
    return await putRequest(`/api/tasks/${id}`, data);
  },

  // Delete a task
  deleteTask: async (id: number) => {
    return await deleteRequest(`/api/tasks/${id}`);
  }
};

// Projects API endpoints (Protected by Auth)
export const projectsApi = {
  // Get all projects for the authenticated user
  getAllProjects: async () => {
    return await getRequest('/api/projects');
  },

  // Create a new project
  createProject: async (data: { title: string }) => {
    return await postRequest('/api/projects', data);
  },

  // Get a specific project
  getProjectById: async (id: string) => {
    return await getRequest(`/api/projects/${id}`);
  },

  // Update a project
  updateProject: async (id: string, data: { title: string }) => {
    return await putRequest(`/api/projects/${id}`, data);
  },

  // Delete a project
  deleteProject: async (id: string) => {
    return await deleteRequest(`/api/projects/${id}`);
  }
}; 