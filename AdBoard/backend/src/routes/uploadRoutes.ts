import express from "express";
import * as uploadController from "../controllers/uploadController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../utils/upload";

const router = express.Router();

// Upload file - requires authentication
router.post(
  "/",
  authenticateToken,
  upload.single("file"),
  uploadController.uploadFile
);

// Delete file - requires authentication
router.delete("/:filename", authenticateToken, uploadController.deleteFile);

export default router;
