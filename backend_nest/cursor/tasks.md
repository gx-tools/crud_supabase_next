

## 🏁 INITIAL SETUP

---

### 1. **Initialize NestJS Project**

* **Start**: Run `nest new backend`
* **End**: Project is scaffolded with `src/`, `main.ts`, `app.module.ts`
* **Test**: Run `npm run start`, see "Hello World" in terminal

---

### 2. **Install Required Dependencies**

* **Start**: Add packages
* **End**: Installed all dependencies below
* **Command**:

  ```bash
  npm install @supabase/supabase-js cookie-parser dotenv
  npm install --save-dev @types/cookie-parser
  ```
* **Test**: No install errors, `npm run start` still works

---

### 3. **Configure `.env` & Global Config Module**

* **Start**: Create `.env`, add Supabase keys
* **End**: `ConfigModule` loads env vars in app
* **Test**: Log `process.env.SUPABASE_URL` inside a service

---

## 🔌 SUPABASE MODULE

---

### 4. **Create `supabase.service.ts`**

* **Start**: Create service that initializes Supabase client
* **End**: `SupabaseService` with `this.supabase = createClient(...)`
* **Test**: Inject it into a dummy controller, call `.auth.getSession()`

---

### 5. **Create `supabase.module.ts`**

* **Start**: Wrap service in a module
* **End**: Export `SupabaseService` for global use
* **Test**: Import it in `AppModule` with no errors

---

## 🔐 AUTH MODULE

---

### 6. **Generate `auth/` module + controller + service**

* **Start**: Run Nest CLI
* **End**: Files: `auth.module.ts`, `auth.controller.ts`, `auth.service.ts`
* **Test**: Nest compiles with no missing provider errors

---

### 7. **Create `signup.dto.ts`**

* **Start**: Define DTO with `email`, `password`
* **End**: DTO with validation decorators
* **Test**: Print validated body in controller

---

### 8. **Create `login.dto.ts`**

* **Start**: Define DTO with `email`, `password`
* **End**: DTO with validation decorators
* **Test**: Use with `@Body()` in controller and log the values

---

### 9. **Implement `signup()` in `auth.service.ts`**

* **Start**: Use Supabase `.auth.signUp()`
* **End**: Handle Supabase response + return clean message
* **Test**: Call via controller, print success or error

---

### 10. **Implement `signup()` route in `auth.controller.ts`**

* **Start**: Hook up `POST /auth/signup`
* **End**: Validates DTO, calls service, returns response
* **Test**: Use Postman to sign up new user

---

### 11. **Implement `login()` in `auth.service.ts`**

* **Start**: Use `.auth.signInWithPassword()`
* **End**: On success, return access token
* **Test**: Print token on successful login

---

### 12. **Set Supabase JWT in HTTP-only cookie**

* **Start**: In `auth.controller.ts`, use `res.cookie(...)`
* **End**: Store token with flags: `httpOnly`, `secure`, `sameSite`
* **Test**: Use Postman → login → inspect `Set-Cookie` header

---

## 🛡️ AUTH GUARD

---

### 13. **Create `auth.guard.ts` in `common/guards/`**

* **Start**: Create custom `CanActivate` guard
* **End**: Verifies Supabase JWT, attaches `user_id` to `request.user`
* **Test**: Use it on a dummy route, log `request.user`

---

### 14. **Create `@User()` decorator**

* **Start**: Create custom decorator using `@createParamDecorator`
* **End**: Returns `req.user`
* **Test**: Inject in dummy route, return it

---

## ✅ TASKS MODULE

---

### 15. **Generate `tasks/` module + controller + service**

* **Start**: Run Nest CLI
* **End**: Files: `tasks.module.ts`, `tasks.controller.ts`, `tasks.service.ts`
* **Test**: Nest compiles with all modules working

---

### 16. **Create `create-task.dto.ts`**

* **Start**: Fields: `title` (required), `completed` (optional)
* **End**: Validated DTO
* **Test**: Log in controller

---

### 17. **Create `update-task.dto.ts`**

* **Start**: Fields: `title?`, `completed?`
* **End**: Optional props, validated DTO
* **Test**: Log in controller

---

### 18. **Implement `POST /tasks`**

* **Start**: Auth guard → `TasksService.create(...)`
* **End**: Insert into Supabase `tasks` with `user_id`
* **Test**: Create task via Postman

---

### 19. **Implement `GET /tasks`**

* **Start**: Auth guard → `TasksService.findAll(userId)`
* **End**: Query `tasks` table filtered by user
* **Test**: Get tasks for logged-in user

---

### 20. **Implement `PUT /tasks/:id`**

* **Start**: Check task belongs to user → update
* **End**: Only allow updates on user's own tasks
* **Test**: Update task title via Postman

---

### 21. **Implement `DELETE /tasks/:id`**

* **Start**: Auth guard → check ownership → delete
* **End**: Return success/failure
* **Test**: Delete task and ensure it's gone

---

## 🎯 FINALIZATION

---

### 22. **Test Cookie Auth End-to-End**

* **Start**: Login, get cookie, access protected `/tasks`
* **End**: Cookie auth works fully
* **Test**: Use Postman or browser to test flow

---

### 23. **Enable CORS and Cookie Middleware**

* **Start**: Add `app.enableCors({ credentials: true })` and `cookie-parser`
* **End**: Frontend can send cookies
* **Test**: Test frontend-to-backend request with cookie auth

---

### 24. **Write `.env.example` + README for setup**

* **Start**: Add required variables
* **End**: Easy onboarding for new devs
* **Test**: Clone fresh → follow README → works