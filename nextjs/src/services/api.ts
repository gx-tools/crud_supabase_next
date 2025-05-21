import { getRequest, postRequest, putRequest, patchRequest } from '@/helpers/handlers';
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
    // Using a custom delete since we don't have deleteRequest in handlers.ts
    const response = await axiosInstance.delete(`/api/tasks/${id}`);
    return response.data;
  }
}; 