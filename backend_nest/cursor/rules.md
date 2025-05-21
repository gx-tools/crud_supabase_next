# ✅ Backend Coding Rules and Best Practices

---

## 🧾 1. Environment Variables

* **DO NOT hardcode** any credentials, URLs, or magic values.
* Use `process.env` to access variables.
* **Document all required variables** in `.env.example`.
* If anything is unclear or missing, ask the maintainer (you).

---

## 🧵 2. String Constants

* Define **all hardcoded strings** (e.g., messages, table names, error keys, Supabase policies) inside a **central `string-const.ts`** file.
* Use **categorized enums or objects** for structure.

```ts
// helpers/string-const.ts
export enum TABLES {
  TASKS = 'tasks',
}

export enum MESSAGES {
  USER_NOT_FOUND = 'User not found',
  TASK_NOT_FOUND = 'Task not found',
}
```

Use like:

```ts
supabase.from(TABLES.TASKS).select(...)
throw new NotFoundException(MESSAGES.TASK_NOT_FOUND)
```

---

## 📦 3. DTOs and Validation

* All inputs must use `DTOs` with `class-validator` and `class-transformer`.
* **Separate DTOs** for:

  * `CreateXDto`
  * `UpdateXDto`
  * `DeleteXDto` (when using body/payload)
* Mark optional fields using `@IsOptional()` and validate types strictly.

Example:

```ts
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
```

---

## ♻️ 4. No Repeated Code

* **DRY (Don't Repeat Yourself)**: All repeated logic must go into helper functions or services.
* For example:

  * Token extraction → helper
  * Setting cookie → helper
  * Supabase error formatting → helper
  * Common DB queries → utility service

---

## 🌐 5. Global App Configuration

Apply these in `main.ts`:

### ✅ Global Prefix

```ts
app.setGlobalPrefix('api');
```

### ✅ Global CORS

```ts
app.enableCors({
  origin: true,
  credentials: true,
});
```

### ✅ Global Cookie Parser

```ts
import * as cookieParser from 'cookie-parser';
app.use(cookieParser());
```

---

## 🚨 6. Global Exception Filters

* Use NestJS **`HttpExceptionFilter`** to catch and format all errors.
* Customize to return:

  * `statusCode`
  * `message`
  * `timestamp`
  * `path`

Apply globally in `main.ts`:

```ts
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
app.useGlobalFilters(new HttpExceptionFilter());
```

Filter example:

```ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = exception.message || 'Unexpected error occurred';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

---

## 🛠 7. Helper Functions

* All utility logic (e.g. parsing cookies, verifying tokens, formatting DB errors) should be placed in:

  * `helpers/` or `utils/` folder.
* Write **pure and reusable** functions, e.g.:

  * `parseCookies()`
  * `verifySupabaseToken()`
  * `getUserFromRequest()`
  * `formatSupabaseError()`

---

## 📌 8. Task-Specific Guidelines

### 🔐 Auth:

* JWT is set as HTTP-only cookie.
* Extract token from cookies on protected routes.
* Validate Supabase session from token before any data access.

### ✅ Tasks:

* Each user’s tasks are filtered by `user_id`.
* Only allow read/update/delete on a user’s own tasks.
* Use Supabase `tasks` table; table name is referenced from string constants.

---
