import { ContentRepository } from "../domain/repositories/ContentRepository";
import {
  ContentEntity,
  CreateContentDto,
  UpdateContentDto,
} from "../domain/entities/ContentEntity";
import { logger } from "../config/logger";
import * as uploadUtils from "../utils/upload";
import path from "path";
import mongoose from "mongoose";
import { Campaign } from "../models";

export class ContentService {
  private contentRepository: ContentRepository;

  constructor(contentRepository: ContentRepository) {
    this.contentRepository = contentRepository;
  }

  /**
   * Get all content
   */
  async getAllContent(): Promise<ContentEntity[]> {
    try {
      return await this.contentRepository.findAll();
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting all content: ${err.message}`);
      throw new Error("Failed to retrieve content");
    }
  }

  /**
   * Get content by ID
   */
  async getContentById(id: string): Promise<ContentEntity | null> {
    try {
      return await this.contentRepository.findById(id);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting content by ID ${id}: ${err.message}`);
      throw new Error("Failed to retrieve content");
    }
  }

  /**
   * Create new content
   */
  async createContent(
    contentData: CreateContentDto,
    file?: Express.Multer.File
  ): Promise<ContentEntity> {
    try {
      // Validate file requirement for image/video content
      if (
        !file &&
        (contentData.type === "image" || contentData.type === "video")
      ) {
        throw new Error("File required for image or video content");
      }

      // Set URL based on uploaded file or provided URL
      let url = contentData.url;
      if (file) {
        url = `/uploads/${file.filename}`;
        contentData.size = file.size;
        contentData.format = file.mimetype;
      }

      const createData: CreateContentDto = {
        ...contentData,
        url,
        duration: contentData.duration || 10,
        status: contentData.status || "active",
      };

      return await this.contentRepository.create(createData);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating content: ${err.message}`);
      throw new Error(
        err.message.includes("File required")
          ? err.message
          : "Failed to create content"
      );
    }
  }

  /**
   * Update existing content
   */
  async updateContent(
    id: string,
    updateData: UpdateContentDto,
    file?: Express.Multer.File
  ): Promise<ContentEntity> {
    try {
      // Check if content exists
      const existingContent = await this.contentRepository.findById(id);
      if (!existingContent) {
        throw new Error("Content not found");
      }

      // Handle file replacement
      if (file) {
        // Delete old file if it was an upload
        if (existingContent.url.startsWith("/uploads/")) {
          const oldFilename = path.basename(existingContent.url);
          try {
            await uploadUtils.deleteFile(oldFilename);
          } catch (err) {
            logger.warn(`Could not delete old file: ${oldFilename}`);
          }
        }

        // Update with new file info
        updateData.url = `/uploads/${file.filename}`;
        updateData.size = file.size;
        updateData.format = file.mimetype;
      }

      const updatedContent = await this.contentRepository.update(
        id,
        updateData
      );
      if (!updatedContent) {
        throw new Error("Content not found or update failed");
      }

      return updatedContent;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating content ${id}: ${err.message}`);
      throw new Error(
        err.message.includes("not found")
          ? err.message
          : "Failed to update content"
      );
    }
  }

  /**
   * Delete content and associated file
   */
  async deleteContent(id: string): Promise<void> {
    try {
      // Check if content is used in any campaigns
      const contentObjectId = new mongoose.Types.ObjectId(id);
      const campaigns = await Campaign.find({ contents: contentObjectId });

      if (campaigns.length > 0) {
        const campaignInfo = campaigns.map((c) => ({
          id: c._id,
          name: c.name,
        }));
        throw new Error(
          `Cannot delete content that is used in campaigns: ${JSON.stringify(
            campaignInfo
          )}`
        );
      }

      // Get content to check for file deletion
      const content = await this.contentRepository.findById(id);
      if (!content) {
        throw new Error("Content not found");
      }

      // Delete associated file if it's an upload
      if (content.url.startsWith("/uploads/")) {
        const filename = path.basename(content.url);
        try {
          await uploadUtils.deleteFile(filename);
        } catch (err) {
          logger.warn(`Could not delete file: ${filename}`);
        }
      }

      await this.contentRepository.delete(id);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting content ${id}: ${err.message}`);
      throw new Error(
        err.message.includes("Cannot delete") ||
        err.message.includes("not found")
          ? err.message
          : "Failed to delete content"
      );
    }
  }

  /**
   * Get content by type
   */
  async getContentByType(
    type: "image" | "video" | "html" | "url"
  ): Promise<ContentEntity[]> {
    try {
      return await this.contentRepository.findByType(type);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting content by type ${type}: ${err.message}`);
      throw new Error("Failed to retrieve content by type");
    }
  }

  /**
   * Get content by status
   */
  async getContentByStatus(
    status: "active" | "inactive"
  ): Promise<ContentEntity[]> {
    try {
      return await this.contentRepository.findByStatus(status);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting content by status ${status}: ${err.message}`);
      throw new Error("Failed to retrieve content by status");
    }
  }

  /**
   * Get content by campaign ID
   */
  async getContentByCampaignId(campaignId: string): Promise<ContentEntity[]> {
    try {
      return await this.contentRepository.findByCampaignId(campaignId);
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Error getting content by campaign ID ${campaignId}: ${err.message}`
      );
      throw new Error("Failed to retrieve content by campaign");
    }
  }
}
