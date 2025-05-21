import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const router = express.Router();

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "AdBoard API",
      version: "1.0.0",
      description: "API documentation for the AdBoard digital signage system",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/models/*.ts", "./src/controllers/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocs));

export default router;
