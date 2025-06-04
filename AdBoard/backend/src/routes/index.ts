import express from "express";
import userRoutes from "./userRoutes";
import deviceRoutes from "./deviceRoutes";
import { createContentRoutes } from "./contentRoutes";
import campaignRoutes from "./campaignRoutes";
import authRoutes from "./authRoutes";
import { ContentController } from "../controllers/contentController";

// Interface for all controllers that will be injected
export interface Controllers {
  contentController: ContentController;
  // Add other controllers here as we convert them
}

// Create routes with dependency-injected controllers
export function createRoutes(controllers: Controllers): express.Router {
  const router = express.Router();

  // Root API route
  router.get("/", (req, res) => {
    res.json({
      message: "AdBoard API",
      version: "1.0.0",
      endpoints: [
        "/api/auth",
        "/api/users",
        "/api/devices",
        "/api/content",
        "/api/campaigns",
        "/api/docs", // Added Swagger docs endpoint
      ],
    });
  });

  // Routes - some still use old pattern, will be converted progressively
  router.use("/auth", authRoutes);
  router.use("/users", userRoutes);
  router.use("/devices", deviceRoutes);
  router.use("/content", createContentRoutes(controllers.contentController));
  router.use("/campaigns", campaignRoutes);

  return router;
}

export default createRoutes;
