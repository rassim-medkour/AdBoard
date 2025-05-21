import express from "express";
import * as contentController from "../controllers/contentController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../utils/upload";

const router = express.Router();

// GET all content
router.get("/", contentController.getAllContent);

// GET content by ID
router.get("/:id", contentController.getContentById);

// POST create content with file upload
router.post("/", 
  authenticateToken, 
  upload.single("file"), 
  contentController.createContent
);

// PUT update content with optional file replacement
router.put("/:id", 
  authenticateToken, 
  upload.single("file"), 
  contentController.updateContent
);

// DELETE content and associated file
router.delete("/:id", authenticateToken, contentController.deleteContent);

export default router;
