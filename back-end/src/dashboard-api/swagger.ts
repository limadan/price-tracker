import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Price Tracker Dashboard API',
    version: '1.0.0',
    description:
      'API for managing products, viewing price reports, and checking logs for the Price Tracker application.',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
    {
      url: 'https://price-tracker-5i50.onrender.com/api',
      description: 'Production server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/dashboard-api/routes/*.ts', './src/dashboard-api/types/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
