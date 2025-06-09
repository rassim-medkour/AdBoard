import { BaseRepository } from "./BaseRepository";
import { ContentEntity } from "../entities/ContentEntity";

/**
 * Content repository interface
 * Extends the base repository with content-specific operations
 */
export interface ContentRepository extends BaseRepository<ContentEntity> {
  /**
   * Find content by type
   * @param type - The content type to filter by
   * @returns Promise resolving to an array of content
   */
  findByType(
    type: "image" | "video" | "html" | "url"
  ): Promise<ContentEntity[]>;

  /**
   * Find content by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of content
   */
  findByStatus(status: "active" | "inactive"): Promise<ContentEntity[]>;

  /**
   * Find content associated with a campaign
   * @param campaignId - The campaign ID
   * @returns Promise resolving to an array of content
   */
  findByCampaignId(campaignId: string): Promise<ContentEntity[]>;
}
