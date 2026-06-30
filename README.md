## Getting Started

This a mini dashboard built with **Next.js (App Router)**, **TypeScript**, **shadcn/ui**, **TanStack Query**, and **external JWT-based API authentication**.

It provides full CRUD management for projects with server-side search, filtering and pagination.

### Installation and Setup

#### 1. Install dependencies

First, install the project dependencies.

```bash
npm install
```

#### 2. Setup env variables

Create a `.env` or `.env.local` file from  `.env.example`.

```yaml
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXTAUTH_SECRET=your-secret # Generate with 'openssl rand -base64 32' command.
NEXTAUTH_URL=http://localhost:3000
```

#### 3. Run the backend api

All the data are fetched from an external backend API. So, you need to run the backend before running the development server here.
Make sure to properly set this env variable, otherwise the app won't work.

```yaml
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Please, you need to check out [the backend GitHub repository](https://github.com/trabdlkarim/dimov-mini-saas-api) and follow the instructions to run it before proceeding.

#### 4. Run development server

You can finally run the development server:

```bash
npm run dev
```

Open now [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Authentication

- JWT authentication via external API
- Session management using `next-auth`
- Secure API requests using Bearer token
- Protected routes

### Project Management (CRUD)

- Create projects
- Edit projects
- Delete projects (with confirmation dialog)
- View projects in data table

### Advanced DataTable

- Server-side search
- Server-side filtering by project status

### UX Enhancements

- Debounced live search
- Optimistic UI updates via React Query
- Toast notifications (Sonner)
- Loading states without UI flicker
- Confirmation dialogs for destructive actions

## Live Demo

Check out a [live demo](https://dimov-mini-saas.vercel.app/auth/login) of the app deployed on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

![Preview](https://raw.githubusercontent.com/trabdlkarim/assets/main/dimov-mini-saas/dashboard-preview.png)

### Credentials

**Username:** user@test.com

**Password:** Pass1234
