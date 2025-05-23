# Backend API Documentation

This document describes the complete API for the NestJS backend with Supabase integration.

## Base URL

All API endpoints are prefixed with `/api`:
```
Base URL: already in .
```

## Authentication

All endpoints (except auth routes) require authentication via cookies:
- **Cookie Required**: `access_token=<supabase-jwt-token>`
- **Content-Type**: `application/json`

## Projects Module

### Overview

The Projects module provides CRUD operations for managing projects. All operations are secured with RLS (Row Level Security) policies that ensure users can only access their own projects.

### Schema
```typescript
interface Project {
  id: string;           // UUID (auto-generated)
  title: string;        // Project title
  created_by: string;   // UUID (user ID)
  created_at: string;   // ISO timestamp
  updated_at: string;   // ISO timestamp
}
```

### API Endpoints

#### 1. Create Project
```http
POST /api/projects
```

**Request Headers:**
```
Content-Type: application/json
Cookie: access_token=<jwt-token>
```

**Request Body:**
```json
{
  "title": "My New Project"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My New Project",
    "created_by": "user-uuid",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "statusCode": 400,
    "message": ["title should not be empty", "title must be a string"],
    "error": "Bad Request"
  }
}
```

---

#### 2. Get All Projects
```http
GET /api/projects
```

**Request Headers:**
```
Cookie: access_token=<jwt-token>
```

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Project 1",
      "created_by": "user-uuid",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "987fcdeb-51a2-43d1-9c4f-123456789abc",
      "title": "Project 2",
      "created_by": "user-uuid",
      "created_at": "2024-01-14T09:15:00.000Z",
      "updated_at": "2024-01-14T09:15:00.000Z"
    }
  ]
}
```

---

#### 3. Get Project by ID
```http
GET /api/projects/:id
```

**Request Headers:**
```
Cookie: access_token=<jwt-token>
```

**Path Parameters:**
- `id` (string, required): Project UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My Project",
    "created_by": "user-uuid",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Project not found",
  "data": {
    "statusCode": 404,
    "message": "Project not found",
    "error": "Not Found"
  }
}
```

---

#### 4. Update Project
```http
PUT /api/projects/:id
```

**Request Headers:**
```
Content-Type: application/json
Cookie: access_token=<jwt-token>
```

**Path Parameters:**
- `id` (string, required): Project UUID

**Request Body:**
```json
{
  "title": "Updated Project Title"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Project Title",
    "created_by": "user-uuid",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T11:45:00.000Z"
  }
}
```

---

#### 5. Delete Project
```http
DELETE /api/projects/:id
```

**Request Headers:**
```
Cookie: access_token=<jwt-token>
```

**Path Parameters:**
- `id` (string, required): Project UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## Tasks Module

### Schema
```typescript
interface Task {
  id: string;           // UUID (auto-generated)
  title: string;        // Task title
  completed: boolean;   // Task completion status
  created_by: string;   // UUID (user ID)
  created_at: string;   // ISO timestamp
  updated_at: string;   // ISO timestamp
}
```

### API Endpoints

#### 1. Create Task
```http
POST /api/tasks
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "completed": false
}
```

**Response:** Similar structure to projects

#### 2. Get All Tasks
```http
GET /api/tasks
```

#### 3. Get Task by ID
```http
GET /api/tasks/:id
```

#### 4. Update Task
```http
PUT /api/tasks/:id
```

**Request Body:**
```json
{
  "title": "Updated task title",
  "completed": true
}
```

#### 5. Delete Task
```http
DELETE /api/tasks/:id
```

---

## Users Module

### API Endpoints

#### Get User Information
```http
GET /api/users
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "email": "user@example.com",
    "role": "user"
  }
}
```

---

## Auth Module

### API Endpoints

#### 1. Sign Up
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

#### 2. Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "session": {
      "access_token": "jwt-token",
      "refresh_token": "refresh-token",
      "expires_in": 3600,
      "user": {
        "id": "user-uuid",
        "email": "user@example.com"
      }
    }
  }
}
```

**Sets Cookie:**
```
access_token=<jwt-token>; HttpOnly; Secure; SameSite=Strict
```

#### 3. Logout
```http
POST /api/auth/logout
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### 4. Check Auth Status
```http
GET /api/auth/status
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User is authenticated",
  "data": {
    "email": "user@example.com",
    "id": "user-uuid",
    "role": "user"
  }
}
```

---

## Error Responses

### Common Error Formats

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized access",
  "data": {
    "statusCode": 401,
    "message": "Unauthorized access",
    "error": "Unauthorized"
  }
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "statusCode": 400,
    "message": ["field should not be empty"],
    "error": "Bad Request"
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "data": {
    "statusCode": 500,
    "message": "Something went wrong",
    "error": "Internal Server Error"
  }
}
```

---

## Security Features

- **Row Level Security (RLS)**: All data operations are secured at the database level
- **JWT Authentication**: Secure token-based authentication
- **HttpOnly Cookies**: Tokens stored in secure cookies
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: All inputs validated using class-validator
- **Error Handling**: Consistent error responses across all endpoints

---

## Testing

Run the test suite:
```bash
npm test
```

All modules include comprehensive unit tests with proper mocking of dependencies and authentication guards. 