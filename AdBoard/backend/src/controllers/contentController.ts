import { Request, Response } from "express";
import { Content, Campaign } from "../models";
import { logger } from "../config/logger";
import mongoose from "mongoose";
import * as uploadUtils from "../utils/upload";
import path from "path";

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
 */
export const getAllContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const content = await Content.find();
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
 */
export const getContentById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const content = await Content.findById(req.params.id);
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
 */
export const createContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, description, contentType, duration, status } = req.body;

    // File will be processed by multer middleware
    if (!req.file && (contentType === "image" || contentType === "video")) {
      return res
        .status(400)
        .json({ message: "File required for image or video content" });
    }

    // Determine the URL based on whether a file was uploaded
    let url = req.body.url;

    // If file was uploaded, use its path
    if (req.file) {
      url = `/uploads/${req.file.filename}`;
    }

    const content = new Content({
      title,
      description,
      contentType,
      url,
      duration: duration || 10,
      status: status || "active",
    });

    await content.save();
    return res.status(201).json(content);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating content: ${err.message}`);
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
 */
export const updateContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, description, contentType, duration, status } = req.body;
    let { url } = req.body;

    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // If new file is uploaded, update URL and delete old file if it was an upload
    if (req.file) {
      // If previous content was an uploaded file, delete it
      if (content.url.startsWith("/uploads/")) {
        const oldFilename = path.basename(content.url);
        try {
          await uploadUtils.deleteFile(oldFilename);
        } catch (err) {
          logger.warn(`Could not delete old file: ${oldFilename}`);
        }
      }

      // Set new URL to uploaded file
      url = `/uploads/${req.file.filename}`;
    }

    // Update content fields
    if (title) content.title = title;
    if (description) content.description = description;
    if (contentType)
      content.contentType = contentType as "image" | "video" | "html" | "url";
    if (url) content.url = url;
    if (duration) content.duration = duration;
    if (status) content.status = status as "active" | "inactive";

    await content.save();
    return res.status(200).json(content);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating content: ${err.message}`);
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
 */
export const deleteContent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Check if content is used in any campaigns
    const contentId = new mongoose.Types.ObjectId(req.params.id);
    const campaigns = await Campaign.find({ contents: contentId });

    if (campaigns.length > 0) {
      return res.status(400).json({
        message: "Cannot delete content that is used in campaigns",
        campaigns: campaigns.map((c) => ({ id: c._id, name: c.name })),
      });
    }

    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // If content URL is from uploads, delete the file
    if (content.url.startsWith("/uploads/")) {
      const filename = path.basename(content.url);
      try {
        await uploadUtils.deleteFile(filename);
      } catch (err) {
        logger.warn(`Could not delete file: ${filename}`);
      }
    }

    await Content.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Content deleted successfully" });  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting content: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
