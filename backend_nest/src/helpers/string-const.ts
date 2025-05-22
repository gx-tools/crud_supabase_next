export enum TABLES {
  TASKS = 'tasks',
  USERS = 'users',
}

export enum ENVS {
  SUPABASE_URL = 'SUPABASE_URL',
  SUPABASE_ANON_KEY = 'SUPABASE_ANON_KEY',
  PORT = 'PORT',
}

export enum MESSAGES {
  USER_NOT_FOUND = 'User not found',
  TASK_NOT_FOUND = 'Task not found',
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
}

export enum COOKIE {
  ACCESS_TOKEN = 'access_token',
}

export enum ROUTES {
  AUTH = 'auth',
  TASKS = 'tasks',
  LOGIN = 'login',
  SIGNUP = 'signup',
  LOGOUT = 'logout',
  STATUS = 'status',
} 