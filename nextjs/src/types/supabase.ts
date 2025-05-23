export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Task related types
export interface Task {
  id: number;
  created_by: string; // User ID of the creator
  title: string; // Description or content of the task
  completed: boolean;
  created_at: string; // ISO date string
}

export interface CreateTaskDto {
  tasks: string;
  completed?: boolean; // Defaults to false if not provided
  // created_by is typically set by the backend based on the authenticated user
  // created_at is automatically set by the database
}

export interface UpdateTaskDto {
  tasks?: string;
  completed?: boolean;
  // id is used as a route parameter or in the WHERE clause for the update, not in the body
}

// Project related types
export interface Project {
  id: string; // UUID (auto-generated)
  title: string; // Project title
  created_by: string; // UUID (user ID)
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface CreateProjectDto {
  title: string;
  // created_by is set by the backend based on the authenticated user
  // created_at and updated_at are automatically set by the database
}

export interface UpdateProjectDto {
  title: string;
  // id is used as a route parameter, updated_at is automatically set by the database
}

// User related types
export interface User {
  id: string; // Corresponds to Supabase auth.users.id (UUID)
  role: string; // e.g., 'student', 'admin', 'instructor'
  email: string; // User's email address
  created_at: string; // ISO date string, from the public.users table
}

export interface CreateUserDto {
  id: string; // Should be the auth.user.id from Supabase
  email: string;
  role?: string; // Assign a default role if not provided (e.g., 'user')
  // created_at is automatically set by the database when the user record is created
}

export interface UpdateUserDto {
  role?: string;
  email?: string; // If email updates are allowed, ensure proper verification
}

// Generic API Response type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// If you need types for the 'debug_log' table, you can define them here.
// For example:
/*
export interface DebugLog {
  id: number;
  created_at: string | null;
  message: string | null;
}

export interface CreateDebugLogDto {
  message?: string | null;
  // id and created_at are typically auto-generated or set by the database
}

export interface UpdateDebugLogDto {
  message?: string | null;
  // id is used to identify the log entry to update
}
*/
