export const corsConfig = {
  origin: (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, ''),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
