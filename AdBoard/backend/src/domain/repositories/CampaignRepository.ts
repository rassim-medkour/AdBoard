import { BaseRepository } from './BaseRepository';
import { CampaignEntity, CreateCampaignDto, UpdateCampaignDto } from '../entities/CampaignEntity';

/**
 * Campaign repository interface
 * Extends the base repository with campaign-specific operations
 */
export interface CampaignRepository extends BaseRepository<CampaignEntity> {
  /**
   * Find campaigns by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of campaigns
   */
  findByStatus(status: 'draft' | 'active' | 'paused' | 'completed'): Promise<CampaignEntity[]>;
  
  /**
   * Find active campaigns for a device
   * @param deviceId - The device ID
   * @returns Promise resolving to an array of campaigns
   */
  findActiveForDevice(deviceId: string): Promise<CampaignEntity[]>;
  
  /**
   * Find campaigns by date range
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Promise resolving to an array of campaigns
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<CampaignEntity[]>;
  
  /**
   * Add content to a campaign
   * @param campaignId - The campaign ID
   * @param contentId - The content ID to add
   * @returns Promise resolving to the updated campaign or null if not found
   */
  addContent(campaignId: string, contentId: string): Promise<CampaignEntity | null>;
  
  /**
   * Remove content from a campaign
   * @param campaignId - The campaign ID
   * @param contentId - The content ID to remove
   * @returns Promise resolving to the updated campaign or null if not found
   */
  removeContent(campaignId: string, contentId: string): Promise<CampaignEntity | null>;
}
