import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AdBoard API',
    version: '1.0.0',
    description: 'API documentation for the AdBoard digital signage system',
    contact: {
      name: 'AdBoard Support',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
    {
      url: 'https://api.adboard.com',
      description: 'Production server',
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
};

// Get absolute paths to API files
const controllersPath = path.resolve(__dirname, '../controllers/*.ts');
const modelsPath = path.resolve(__dirname, '../models/*.ts');
const routesPath = path.resolve(__dirname, '../routes/*.ts');

// Options for the swagger docs
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [controllersPath, modelsPath, routesPath],
};

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJSDoc(options);

/**
 * Function to setup Swagger UI
 */
export const setupSwagger = (app: Express): void => {
  // Serve swagger docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Serve swagger spec as JSON
  app.get('/api/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('🔄 Swagger documentation available at /api/docs');
};
