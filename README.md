# Fullstack Monorepo

A monorepo containing a Next.js frontend and Nest.js backend application.

## Structure

```
fullstack-monorepo/
├── apps/
│   ├── frontend/          # Next.js application
│   └── backend/           # Nest.js application
├── packages/              # Shared packages (if needed)
├── pnpm-workspace.yaml    # PNPM workspace configuration
└── package.json           # Root package.json with workspace scripts
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

Run both applications in development mode:

```bash
pnpm dev
```

Or run them individually:

```bash
# Frontend only (Next.js - http://localhost:3000)
pnpm frontend:dev

# Backend only (Nest.js - http://localhost:3001)
pnpm backend:dev
```

### Build

Build both applications:

```bash
pnpm build
```

Or build them individually:

```bash
pnpm frontend:build
pnpm backend:build
```

### Production

Start both applications in production mode:

```bash
pnpm start
```

Or start them individually:

```bash
pnpm frontend:start
pnpm backend:start
```

## Applications

### Frontend (Next.js)
- **Location**: `apps/frontend`
- **Port**: 3000 (development)
- **Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn/ui
- **UI Components**: Pre-configured with Shadcn/ui components (Button, Card, Input, Label)

### Backend (Nest.js)
- **Location**: `apps/backend`
- **Port**: 3001 (development)
- **Tech Stack**: Nest.js, TypeScript
- **API Documentation**: Swagger/OpenAPI available at `http://localhost:3001/api`
- **Features**: CORS enabled, sample Users API with full CRUD operations

## Available Scripts

### Development
- `pnpm dev` - Start both apps in development mode
- `pnpm build` - Build both applications
- `pnpm start` - Start both apps in production mode
- `pnpm lint` - Lint both applications
- `pnpm test` - Run tests for both applications
- `pnpm frontend:dev` - Start only the frontend in development
- `pnpm backend:dev` - Start only the backend in development

### Docker
- `pnpm docker:up` - Start all services with Docker (production)
- `pnpm docker:dev` - Start development containers with hot reload
- `pnpm docker:down` - Stop all Docker services
- `pnpm docker:logs` - View logs from all services
- `pnpm docker:clean` - Clean up containers and images

## Features

### Shadcn/ui Components (Frontend)

The frontend comes pre-configured with Shadcn/ui components. To add more components:

```bash
cd apps/frontend
npx shadcn@latest add [component-name]
```

Available components include: button, card, input, label, dialog, dropdown-menu, and many more.

### API Documentation (Backend)

The backend includes Swagger/OpenAPI documentation with sample endpoints:

- **GET** `/` - Hello World endpoint
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get user by ID
- **POST** `/users` - Create a new user
- **PUT** `/users/:id` - Update user by ID
- **DELETE** `/users/:id` - Delete user by ID

Access the interactive API documentation at: `http://localhost:3001/api`

## Docker Support

The project includes full Docker support for both development and production environments.

### Quick Start with Docker

```bash
# Production mode
pnpm docker:up

# Development mode with hot reload
pnpm docker:dev
```

### Access Points (Docker)
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Nginx Proxy**: http://localhost (routes to both services)
- **Swagger Docs**: http://localhost/docs

For detailed Docker setup and configuration, see [DOCKER.md](./DOCKER.md).

## Adding Shared Packages

To add shared packages that can be used by both applications:

1. Create a new package in the `packages/` directory
2. Add it to the `pnpm-workspace.yaml` (already configured)
3. Install it in your apps using: `pnpm add @your-scope/package-name --filter frontend`
