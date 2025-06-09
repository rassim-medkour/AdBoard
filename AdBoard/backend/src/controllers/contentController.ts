import { Request, Response } from "express";
import { logger } from "../config/logger";
import { ContentService } from "../services/ContentService";
export class ContentController {
  private contentService: ContentService;

  constructor(contentService: ContentService) {
    this.contentService = contentService;
  }

  /**
   * Get all content
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
   */ getAllContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const content = await this.contentService.getAllContent();
      return res.status(200).json(content);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting content: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Get content by ID
   * @swagger
   * /api/content/{id}:
   *   get:
   *     summary: Get content by ID
   *     tags: [Content]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
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
   */ getContentById = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const content = await this.contentService.getContentById(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      return res.status(200).json(content);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting content: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Create new content with file upload
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
   *                 description: Content title
   *               description:
   *                 type: string
   *                 description: Content description
   *               contentType:
   *                 type: string
   *                 enum: [image, video, html, url]
   *                 description: Type of content
   *               url:
   *                 type: string
   *                 description: URL for external content (required for html and url types)
   *               duration:
   *                 type: number
   *                 description: Duration to display content in seconds
   *               status:
   *                 type: string
   *                 enum: [active, inactive]
   *                 description: Content status
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: File to upload (required for image and video types)
   *             required:
   *               - title
   *               - contentType
   *     responses:
   *       201:
   *         description: Content created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Content'
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */ createContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { title, description, type, duration, status, url } = req.body;

      const content = await this.contentService.createContent(
        {
          title,
          description,
          type: type,
          url,
          duration,
          status,
        },
        req.file
      );

      return res.status(201).json(content);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating content: ${err.message}`);

      // Return appropriate status code based on error type
      if (err.message.includes("File required")) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Update content with optional file replacement
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
   *         required: true
   *         schema:
   *           type: string
   *         description: Content ID
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *                 description: Content title
   *               description:
   *                 type: string
   *                 description: Content description
   *               contentType:
   *                 type: string
   *                 enum: [image, video, html, url]
   *                 description: Type of content
   *               url:
   *                 type: string
   *                 description: URL for external content
   *               duration:
   *                 type: number
   *                 description: Duration to display content in seconds
   *               status:
   *                 type: string
   *                 enum: [active, inactive]
   *                 description: Content status
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: New file to upload (optional)
   *     responses:
   *       200:
   *         description: Content updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Content'
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Content not found
   *       500:
   *         description: Server error
   */ updateContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { title, description, type, duration, status, url } = req.body;

      const content = await this.contentService.updateContent(
        req.params.id,
        {
          title,
          description,
          type,
          url,
          duration,
          status,
        },
        req.file
      );

      return res.status(200).json(content);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating content: ${err.message}`);

      // Return appropriate status code based on error type
      if (err.message.includes("not found")) {
        return res.status(404).json({ message: err.message });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Delete content and associated file
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
   *         required: true
   *         schema:
   *           type: string
   *         description: Content ID
   *     responses:
   *       200:
   *         description: Content deleted successfully
   *       400:
   *         description: Cannot delete content used in campaigns
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Content not found
   *       500:
   *         description: Server error
   */ deleteContent = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      await this.contentService.deleteContent(req.params.id);
      return res.status(200).json({ message: "Content deleted successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting content: ${err.message}`);

      // Return appropriate status code based on error type
      if (err.message.includes("Cannot delete content")) {
        return res.status(400).json({ message: err.message });
      }

      if (err.message.includes("not found")) {
        return res.status(404).json({ message: "Content not found" });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
