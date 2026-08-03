# LoomAI Frontend

This is the Next.js 15 frontend for the LoomAI Textile Marketplace.

## Architecture

- **Next.js App Router**: Utilizes the latest routing paradigms for server and client components.
- **shadcn/ui & Tailwind**: Comprehensive UI component library fully customizable.
- **State Management**: Uses Redux Toolkit for global state and TanStack Query for server state.
- **Feature-Based Structure**: Components are grouped into logical features (Buyer, Supplier, AI) inside `src/features`.

## Getting Started

1. Copy `.env.example` to `.env` and configure it.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Run `npm run lint` to enforce ESLint and Prettier rules.
