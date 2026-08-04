export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LoomAI API',
      version: '1.0.0',
      description: 'LoomAI Backend API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/v1/*.ts', './src/docs/*.yml'],
};
