import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";

const router = express.Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec));

export default router;
