# Maylea Logistics & Transport

## Overview

This is a logistics and transport management application for Maylea, an Italian shipping company. The system allows administrators to create transport documents (shipping forms), manage sender/recipient profiles, track shipments in an archive, and view statistics on weight and revenue. It features a public landing page and a protected admin dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with protected routes for admin dashboard
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for statistics visualization

The frontend follows a component-based architecture with:
- `/client/src/pages/` - Page-level components (Home, Archive, Senders, Recipients, Statistics)
- `/client/src/components/` - Reusable UI components including the form system
- `/client/src/hooks/` - Custom React hooks for auth, sidebar state, and utilities
- `/client/src/lib/` - Shared utilities and API client configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful JSON API under `/api/` prefix
- **Session Management**: Express-session for authentication state

Key backend patterns:
- `/server/routes.ts` - All API route definitions with Zod validation
- `/server/storage.ts` - Data access layer abstracting database operations
- `/server/db.ts` - Database connection setup

### Authentication
- Session-based authentication using express-session with server-side sessions
- Protected routes redirect unauthenticated users to login
- All API routes protected with `requireAuth` middleware
- Default admin credentials: username `admin`, password `maylea2024` (change in production)
- Auth state managed via React context (`useAuth` hook in `/client/src/hooks/use-auth.tsx`)

### Application Structure
- **Landing Page** (`/`) - Public page with company info, services, delivery times, and contact details
- **Login Page** (`/login`) - Admin authentication with session management
- **Dashboard** (`/dashboard/*`) - Protected admin area with all management features:
  - `/dashboard` - Transport document creation
  - `/dashboard/archive` - Document archive
  - `/dashboard/senders` - Sender profiles management
  - `/dashboard/recipients` - Recipient profiles management
  - `/dashboard/statistics` - Weight statistics
  - `/dashboard/income-statistics` - Revenue statistics

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `/shared/schema.ts` using Drizzle's schema builder
- **Validation**: Zod schemas generated from Drizzle schemas using drizzle-zod
- **Database Driver**: postgres.js for connection management

Core database tables:
- `users` - Admin authentication
- `sender_profiles` / `recipient_profiles` - Saved contact profiles
- `transport_documents` - Shipping records with auto-deletion after 4 months
- `weight_stats` / `revenue_stats` - Analytics data

### Shared Code
The `/shared/` directory contains code used by both frontend and backend:
- Database schema definitions
- Zod validation schemas
- TypeScript types derived from schemas

## External Dependencies

### Database
- **PostgreSQL** - Primary data store, connected via `DATABASE_URL` environment variable
- Uses Drizzle ORM with postgres.js driver (not Neon serverless adapter despite package presence)

### Third-Party APIs
- **Google Maps API** - Address validation and autocomplete functionality
  - Requires `GOOGLE_MAPS_API_KEY` environment variable
  - Used in `/server/googleMapsService.ts`

### Payment Integration
- **Stripe** - Payment processing integration present in dependencies
  - `@stripe/stripe-js` and `@stripe/react-stripe-js` packages installed
  - Implementation details for payment flows

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_MAPS_API_KEY` - Google Maps API key for address services
- `SESSION_SECRET` - Secret for signing session cookies (optional, has default)