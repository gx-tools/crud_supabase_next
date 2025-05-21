# Next.js + NestJS + Supabase Todo App

This is a Todo application built with Next.js, integrated with both a NestJS backend API and Supabase.

## Features

- User authentication (login/signup) via NestJS API or direct Supabase
- Task management (create, read, update, delete)
- Toggle between API and Supabase data sources
- Role-based permissions
- Dark/light mode toggle
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A running NestJS backend (see backend_nest folder)
- Supabase account and project (optional if using only the API)

### Installation

1. Clone the repository
2. Navigate to the nextjs directory:
   ```bash
   cd nextjs
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env.local` file in the nextjs directory with the following variables:

```
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3500

# Supabase Configuration (keep these for backward compatibility)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

The application can toggle between using the NestJS API endpoints and direct Supabase access:

1. NestJS API endpoints (when "Using API" is selected):
   - Authentication: `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`
   - Tasks: `/api/tasks`, `/api/tasks/:id`

2. Direct Supabase access (when "Using Supabase" is selected):
   - Uses Supabase client library for auth and database operations

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.io/docs) 