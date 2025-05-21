

# 🏗️ NestJS + Supabase Todo App Backend Architecture

## ⚙️ Stack Overview

* **NestJS** – Backend framework (Modular, scalable, TypeScript-first)
* **Supabase** – Handles authentication (email/password), PostgreSQL DB (`tasks` table)
* **Cookie-based Auth** – Supabase JWT is stored in HTTP-only cookies
* **REST API** – Exposed for login/signup, and todo CRUD

---

## 📁 Folder Structure

```
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/
│       ├── login.dto.ts
│       └── signup.dto.ts
│
├── tasks/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── tasks.module.ts
│   └── dto/
│       ├── create-task.dto.ts
│       └── update-task.dto.ts
│
├── common/
│   ├── guards/
│   │   └── auth.guard.ts
│   └── decorators/
│       └── user.decorator.ts
│
├── supabase/
│   ├── supabase.service.ts
│   └── supabase.module.ts
│
├── app.controller.ts
├── app.module.ts
└── main.ts

.env (already added)
```
SUPABASE_URL = 
SUPABASE_ANON_KEY = 
---

## 🧩 Module Breakdown

### `auth/` – 🔐 Auth Logic (Login, Signup)

* **`auth.controller.ts`** – Handles `/auth/login` and `/auth/signup`
* **`auth.service.ts`** – Calls Supabase Auth API for signUp/signIn, sets JWT in cookie
* **DTOs** – Define shape of login/signup requests

### `tasks/` – ✅ Task CRUD Logic

* **`tasks.controller.ts`** – Handles endpoints: `GET/POST/PUT/DELETE /tasks`
* **`tasks.service.ts`** – Interacts with Supabase DB to manage `tasks` table
* **DTOs** – Validate and define task input data

### `common/guards/` – 🛡️ Auth Guard

* **`auth.guard.ts`** – Checks for Supabase JWT in cookies, verifies token
* **`user.decorator.ts`** – Extracts user info from verified JWT payload

### `supabase/` – 🧬 Supabase SDK Integration

* **`supabase.service.ts`** – Centralized logic for Supabase client config and calls
* **`supabase.module.ts`** – Makes `SupabaseService` injectable across app

### Root

* **`app.module.ts`** – Root NestJS module importing all feature modules
* **`main.ts`** – Entry point; sets up global middlewares, cookie-parser, etc.

---

## 🌐 REST API Endpoints

### Auth

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| POST   | `/auth/signup` | Email/password signup  |
| POST   | `/auth/login`  | Login, sets JWT cookie |

### Tasks (Protected by JWT Guard)

| Method | Endpoint     | Description                   |
| ------ | ------------ | ----------------------------- |
| GET    | `/tasks`     | Get all tasks (user-specific) |
| POST   | `/tasks`     | Create new task               |
| PUT    | `/tasks/:id` | Update task                   |
| DELETE | `/tasks/:id` | Delete task                   |

---

## 🧠 State + Service Flow

### ✅ Login/Signup Flow

1. **Client →** `/auth/login` or `/auth/signup`
2. **NestJS →** Supabase Auth API
3. **Supabase →** Returns `access_token` (JWT)
4. **NestJS →** Sets it in a secure, HTTP-only cookie
5. **Client →** Automatically authenticated in future requests via cookie

---

### 📝 Todo CRUD Flow

1. **Client →** Sends request to `/tasks`
2. **NestJS Guard →** Extracts & verifies JWT from cookie
3. **Guard →** Adds user info to request context
4. **Controller →** Calls `TasksService`
5. **TasksService →** Queries `tasks` table using Supabase client (filter by user)

---

## 🔐 Auth Cookie Details

* Stored as: `access_token`
* **Secure**: `HttpOnly`, `Secure`, `SameSite=Strict`
* Used in server-side guard to verify and identify user

---

## 🧾 Sample Supabase `tasks` Table Schema

| Column      | Type      | Notes              |
| ----------- | --------- | ------------------ |
| id          | UUID      | Primary Key        |
| created_by    | UUID      | From Supabase auth |
| title       | Text      | Task title         |
| completed   | Boolean   | Task status        |
| created\_at | Timestamp | Auto-generated     |

---

## 🛡️ Auth Guard (How it works)

```ts
// common/guards/auth.guard.ts
// 1. Extract cookie
// 2. Verify Supabase JWT using Supabase JWT secret
// 3. Attach user ID to request
```

---

## 🧪 Environment Variables

```env
SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret
SUPABASE_JWT_SECRET=your-jwt-secret
```