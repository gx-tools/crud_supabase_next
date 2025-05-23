export enum TABLES {
  TASKS = 'tasks',
  USERS = 'users',
  PROJECTS = 'projects',
}

export enum ENVS {
  SUPABASE_URL = 'SUPABASE_URL',
  SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY',
  PORT = 'PORT',
}

export enum MESSAGES {
  USER_NOT_FOUND = 'User not found',
  TASK_NOT_FOUND = 'Task not found',
  PROJECT_NOT_FOUND = 'Project not found',
  UNAUTHORIZED = 'Unauthorized access',
  INVALID_CREDENTIALS = 'Invalid credentials',
  SIGNUP_SUCCESS = 'User registered successfully',
  LOGIN_SUCCESS = 'Login successful',
  LOGOUT_SUCCESS = 'Logout successful',
  AUTHENTICATED = 'User is authenticated',
  TASK_CREATED = 'Task created successfully',
  TASK_UPDATED = 'Task updated successfully',
  TASK_DELETED = 'Task deleted successfully',
  TASKS_RETRIEVED = 'Tasks retrieved successfully',
  TASK_RETRIEVED = 'Task retrieved successfully',
  PROJECT_CREATED = 'Project created successfully',
  PROJECT_UPDATED = 'Project updated successfully',
  PROJECT_DELETED = 'Project deleted successfully',
  PROJECTS_RETRIEVED = 'Projects retrieved successfully',
  PROJECT_RETRIEVED = 'Project retrieved successfully',
  USER_RETRIEVED = 'User retrieved successfully',
}

export enum COOKIE {
  ACCESS_TOKEN = 'access_token',
}

export enum ROUTES {
  AUTH = 'auth',
  TASKS = 'tasks',
  USERS = 'users',
  PROJECTS = 'projects',
  LOGIN = 'login',
  SIGNUP = 'signup',
  LOGOUT = 'logout',
  STATUS = 'status',
} 