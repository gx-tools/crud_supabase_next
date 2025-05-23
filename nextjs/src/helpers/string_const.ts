export enum AuthRouteConstants {
  LOGIN = "/auth/login",
  SIGNUP = "/auth/signup",
}

export enum RouteConstants {
  COURSES = "/courses",
  HOME = "/",
  PROJECTS = "/projects",
}

export enum ApiRouteConstants {
  TASKS = "/api/tasks",
  PROJECTS = "/api/projects",
  USERS = "/api/users",
  AUTH_STATUS = "/api/auth/status",
  AUTH_LOGOUT = "/api/auth/logout",
}

export enum SupaBaseTableConstants {
  TASKS = "tasks",
  PROJECTS = "projects",
  ID = "id",
  TITLE = "title",
  COMPLETED = "completed",
  CREATED_BY = "created_by",
  USERS = "users",
  ROLE = "role",
}

export enum SupaBaseRoleConstants {
  ADMIN = "admin",
  STUDENT = "student",
  USER = "user",
  INSTRUCTOR = "instructor",
}

export enum SupaBaseQueryConstants {
  EQUAL = "eq",
  NOT = "not",
  AND = "and",
  OR = "or",
}

export enum CookieConstants {
  ACCESS_TOKEN = "access_token",
}