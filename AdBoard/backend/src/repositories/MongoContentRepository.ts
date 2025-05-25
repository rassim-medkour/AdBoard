import { Model } from "mongoose";
import { Content } from "../models";
import {
  ContentEntity,
  CreateContentDto,
  UpdateContentDto,
} from "../domain/entities/ContentEntity";
import { ContentRepository } from "../domain/repositories/ContentRepository";

/**
 * MongoDB implementation of the ContentRepository interface
 */
export class MongoContentRepository implements ContentRepository {
  private contentModel: Model<any>;

  /**
   * Creates a new MongoContentRepository
   * @param contentModel - The Mongoose model to use (defaults to Content)
   */
  constructor(contentModel = Content) {
    this.contentModel = contentModel;
  }

  /**
   * Converts a Mongoose document to a content entity
   * @param doc - The Mongoose document
   * @returns The content entity or null if the document is null
   */
  private toEntity(doc: any): ContentEntity | null {
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      type: doc.type,
      url: doc.url,
      data: doc.data,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Finds all content
   * @returns Promise resolving to an array of content entities
   */
  async findAll(): Promise<ContentEntity[]> {
    const contents = await this.contentModel.find();
    return contents
      .map((content) => this.toEntity(content))
      .filter((content): content is ContentEntity => content !== null);
  }

  /**
   * Finds content by ID
   * @param id - The content ID
   * @returns Promise resolving to the content entity or null if not found
   */
  async findById(id: string): Promise<ContentEntity | null> {
    const content = await this.contentModel.findById(id);
    return this.toEntity(content);
  }

  /**
   * Finds content by type
   * @param type - The content type to filter by
   * @returns Promise resolving to an array of content entities
   */
  async findByType(
    type: "image" | "video" | "html" | "url"
  ): Promise<ContentEntity[]> {
    const contents = await this.contentModel.find({ type });
    return contents
      .map((content) => this.toEntity(content))
      .filter((content): content is ContentEntity => content !== null);
  }

  /**
   * Finds content by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of content entities
   */
  async findByStatus(status: "active" | "inactive"): Promise<ContentEntity[]> {
    const contents = await this.contentModel.find({ status });
    return contents
      .map((content) => this.toEntity(content))
      .filter((content): content is ContentEntity => content !== null);
  }

  /**
   * Finds content associated with a campaign
   * @param campaignId - The campaign ID
   * @returns Promise resolving to an array of content entities
   */
  async findByCampaignId(campaignId: string): Promise<ContentEntity[]> {
    // This assumes you have a reference to campaigns in your content model
    // If not, you might need to implement this differently based on your data model
    const contents = await this.contentModel.find({ campaign: campaignId });
    return contents
      .map((content) => this.toEntity(content))
      .filter((content): content is ContentEntity => content !== null);
  }

  /**
   * Creates new content
   * @param data - The content data
   * @returns Promise resolving to the created content entity
   */
  async create(data: Partial<ContentEntity>): Promise<ContentEntity> {
    const content = new this.contentModel(data);
    const savedContent = await content.save();
    const entity = this.toEntity(savedContent);
    if (!entity) {
      throw new Error(
        "Failed to create content: Entity conversion returned null"
      );
    }
    return entity;
  }

  /**
   * Updates existing content
   * @param id - The content ID
   * @param data - The updated content data
   * @returns Promise resolving to the updated content entity or null if not found
   */
  async update(
    id: string,
    data: Partial<ContentEntity>
  ): Promise<ContentEntity | null> {
    const updatedContent = await this.contentModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return this.toEntity(updatedContent);
  }

  /**
   * Deletes content
   * @param id - The content ID
   * @returns Promise resolving to true if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.contentModel.findByIdAndDelete(id);
    return !!result;
  }
}
