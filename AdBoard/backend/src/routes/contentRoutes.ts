import express from "express";
import * as contentController from "../controllers/contentController";
import { authenticateToken } from "../middleware/auth";
import { upload } from "../utils/upload";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: API for managing content
 */

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get all content
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: List of content
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Content'
 *       500:
 *         description: Server error
 */
router.get("/", contentController.getAllContent);

/**
 * @swagger
 * /api/content/{id}:
 *   get:
 *     summary: Get content by ID
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Content'
 *       404:
 *         description: Content not found
 *       500:
 *         description: Server error
 */
router.get("/:id", contentController.getContentById);

/**
 * @swagger
 * /api/content:
 *   post:
 *     summary: Create new content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [image, video, html, url]
 *               url:
 *                 type: string
 *               duration:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - title
 *               - contentType
 *     responses:
 *       201:
 *         description: Created content
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", 
  authenticateToken, 
  upload.single("file"), 
  contentController.createContent
);

/**
 * @swagger
 * /api/content/{id}:
 *   put:
 *     summary: Update content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Content ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               contentType:
 *                 type: string
 *                 enum: [image, video, html, url]
 *               url:
 *                 type: string
 *               duration:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated content
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 *       500:
 *         description: Server error
 */
router.put("/:id", 
  authenticateToken, 
  upload.single("file"), 
  contentController.updateContent
);

/**
 * @swagger
 * /api/content/{id}:
 *   delete:
 *     summary: Delete content
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content deleted
 *       400:
 *         description: Cannot delete content used in campaigns
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Content not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateToken, contentController.deleteContent);

export default router;
