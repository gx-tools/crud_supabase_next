export enum TABLES {
  TASKS = 'tasks',
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
}

export enum COOKIE {
  ACCESS_TOKEN = 'access_token',
}

export enum ROUTES {
  AUTH = 'auth',
  TASKS = 'tasks',
  LOGIN = 'login',
  SIGNUP = 'signup',
} 