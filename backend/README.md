# LoomAI Backend

This is the Node.js Express backend for the LoomAI Textile Marketplace, built with Clean Architecture in mind.

## Architecture

- **Controllers**: Handle HTTP requests and responses.
- **Services**: Contain all business logic.
- **Models**: Mongoose schemas and database interactions.
- **Middleware**: Custom Express middlewares (error handling, auth, validation).
- **Utils**: Helper classes and functions (`logger`, `ApiResponse`).

## Getting Started

1. Set up `.env` from `.env.example`.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server with hot-reload.
4. Run `npm run build` to compile TypeScript to JavaScript.
