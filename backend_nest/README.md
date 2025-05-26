<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# NestJS Backend with Supabase

A NestJS backend application integrated with Supabase for authentication and data storage.

## Available Routes

### Authentication Routes (`/api/auth`)

- `POST /api/auth/signup`
  - **Description**: Register a new user
  - **Authentication**: None (public route)
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123" // min 6 characters
    }
    ```
  - **Response**: Success message with 200 status code
  
- `POST /api/auth/login`
  - **Description**: Login user
  - **Authentication**: None (public route)
  - **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response**: Success message with 200 status code
  - **Sets Cookie**: `access_token` (HTTP-only) containing JWT
  
- `POST /api/auth/logout`
  - **Description**: Logout user
  - **Authentication**: Requires `access_token` cookie
  - **Request Body**: None
  - **Response**: Success message with 200 status code
  - **Clears Cookie**: `access_token`
  
- `GET /api/auth/status`
  - **Description**: Check authentication status
  - **Authentication**: Optional `access_token` cookie
  - **Response**: 
    - If authenticated: `{ success: true, message: "User is authenticated", data: { email: "user@example.com", id: "uuid", role: "user" } }`
    - If not authenticated: `{ success: false, message: "Unauthorized access" }`

### Tasks Routes (`/api/tasks`)
All tasks routes require authentication via `access_token` HTTP-only cookie

- `GET /api/tasks`
  - **Description**: Get all tasks for authenticated user
  - **Authentication**: Required `access_token` cookie
  - **Response**: List of tasks belonging to authenticated user
  
- `GET /api/tasks/:id`
  - **Description**: Get a specific task
  - **Authentication**: Required `access_token` cookie
  - **URL Parameters**: `id` - Task UUID
  - **Response**: Task object if it belongs to the authenticated user
  
- `POST /api/tasks`
  - **Description**: Create a new task
  - **Authentication**: Required `access_token` cookie
  - **Request Body**:
    ```json
    {
      "title": "Task title",
      "completed": false // optional, defaults to false
    }
    ```
  - **Response**: Created task object
  
- `PUT /api/tasks/:id`
  - **Description**: Update a task
  - **Authentication**: Required `access_token` cookie
  - **URL Parameters**: `id` - Task UUID
  - **Request Body**:
    ```json
    {
      "title": "Updated title", // optional
      "completed": true // optional
    }
    ```
  - **Response**: Updated task object
  
- `DELETE /api/tasks/:id`
  - **Description**: Delete a task
  - **Authentication**: Required `access_token` cookie
  - **URL Parameters**: `id` - Task UUID
  - **Response**: Success message

### Users Routes (`/api/users`)
All users routes require authentication via `access_token` HTTP-only cookie

- `GET /api/users`
  - **Description**: Get authenticated user's information
  - **Authentication**: Required `access_token` cookie
  - **Response**: User data including email and role
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

## Authentication Flow

The application uses cookie-based authentication with Supabase:

1. **Login Process**:
   - User submits login credentials
   - Server validates credentials with Supabase
   - On success, server sets HTTP-only cookie with JWT
   
2. **Request Authentication**:
   - `access_token` cookie is automatically sent with each request
   - AuthGuard extracts token from cookie
   - AuthGuard validates token with Supabase
   - If token is valid, user data is attached to request
   - If token is invalid, 401 Unauthorized response is returned

3. **Logout Process**:
   - Server clears the `access_token` cookie
   - Supabase session is terminated

## Security Features

- JWT stored in HTTP-only cookies (not accessible via JavaScript)
- Supabase Row Level Security (RLS) enforced
- Environment-specific cookie settings (secure in production)
- All sensitive routes protected by AuthGuard

## Environment Variables

Required environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `PORT` - Port for the server (defaults to 3500)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed frontend origins (for production)
- `FRONTEND_URL` - Main frontend URL (fallback if ALLOWED_ORIGINS is not set)

## CORS Configuration

The application implements Cross-Origin Resource Sharing (CORS) with the following settings:

- **Development Environment**: During development, the following origins are allowed by default:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `http://localhost:5173` (Vite default)
  - `http://127.0.0.1:5173`
  - `http://localhost:8080`
  - `http://127.0.0.1:8080`

- **Production Environment**: In production, allowed origins are set using:
  1. The `ALLOWED_ORIGINS` environment variable (comma-separated list) if provided
  2. Or the `FRONTEND_URL` environment variable as a fallback

You can customize the allowed origins by editing the `ALLOWED_ORIGINS_DEV` array in `src/helpers/cors-config.ts`.

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables
4. Run the development server:
   ```bash
   npm run start:dev
   ```

## Features

- User authentication (signup/login/logout) via Supabase
- JWT stored in HTTP-only cookies for secure authentication
- Task CRUD operations with user-specific data isolation
- REST API with proper validation and error handling

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Supabase account and project

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   PORT=3500
   ```
4. Create a `tasks` table in your Supabase database with the following schema:
   - `id` (UUID, primary key)
   - `created_by` (UUID, references auth.users)
   - `title` (text, required)
   - `completed` (boolean, default: false)
   - `created_at` (timestamp with timezone, default: now())

5. Set up Row Level Security (RLS) on the `tasks` table:
   ```sql
   -- Enable RLS
   alter table tasks enable row level security;

   -- Create policy for users to see only their own tasks
   create policy "Users can view their own tasks" on tasks
     for select using (auth.uid() = created_by);

   -- Create policy for users to insert their own tasks
   create policy "Users can insert their own tasks" on tasks
     for insert with check (auth.uid() = created_by);

   -- Create policy for users to update their own tasks
   create policy "Users can update their own tasks" on tasks
     for update using (auth.uid() = created_by);

   -- Create policy for users to delete their own tasks
   create policy "Users can delete their own tasks" on tasks
     for delete using (auth.uid() = created_by);
   ```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT cookie
- `POST /api/auth/logout` - Logout and clear JWT cookie
- `GET /api/auth/status` - Check if the user is currently authenticated (returns user data if logged in)

### Tasks (Protected by Auth)

- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
