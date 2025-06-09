import { CampaignRepository } from '../domain/repositories/CampaignRepository';
import { CampaignEntity, CreateCampaignDto, UpdateCampaignDto } from '../domain/entities/CampaignEntity';
import { logger } from '../config/logger';

/**
 * Campaign service for business logic
 * Handles campaign-related operations and validation
 */
export class CampaignService {
  constructor(private campaignRepository: CampaignRepository) {}

  /**
   * Get all campaigns
   * @returns Promise resolving to an array of campaign entities
   */
  async getAllCampaigns(): Promise<CampaignEntity[]> {
    try {
      return await this.campaignRepository.findAll();
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting all campaigns: ${err.message}`);
      throw new Error('Failed to retrieve campaigns');
    }
  }

  /**
   * Get campaign by ID
   * @param id - The campaign ID
   * @returns Promise resolving to the campaign entity or null if not found
   */
  async getCampaignById(id: string): Promise<CampaignEntity | null> {
    try {
      if (!id) {
        throw new Error('Campaign ID is required');
      }
      return await this.campaignRepository.findById(id);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting campaign by ID ${id}: ${err.message}`);
      throw new Error('Failed to retrieve campaign');
    }
  }

  /**
   * Get campaigns by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of campaign entities
   */
  async getCampaignsByStatus(status: 'draft' | 'active' | 'paused' | 'completed'): Promise<CampaignEntity[]> {
    try {
      if (!status) {
        throw new Error('Status is required');
      }
      return await this.campaignRepository.findByStatus(status);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting campaigns by status ${status}: ${err.message}`);
      throw new Error('Failed to retrieve campaigns by status');
    }
  }

  /**
   * Get active campaigns for a device
   * @param deviceId - The device ID
   * @returns Promise resolving to an array of campaign entities
   */
  async getActiveForDevice(deviceId: string): Promise<CampaignEntity[]> {
    try {
      if (!deviceId) {
        throw new Error('Device ID is required');
      }
      return await this.campaignRepository.findActiveForDevice(deviceId);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting active campaigns for device ${deviceId}: ${err.message}`);
      throw new Error('Failed to retrieve campaigns for device');
    }
  }

  /**
   * Get campaigns by date range
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Promise resolving to an array of campaign entities
   */
  async getCampaignsByDateRange(startDate: Date, endDate: Date): Promise<CampaignEntity[]> {
    try {
      if (!startDate || !endDate) {
        throw new Error('Start date and end date are required');
      }
      if (startDate >= endDate) {
        throw new Error('Start date must be before end date');
      }
      return await this.campaignRepository.findByDateRange(startDate, endDate);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting campaigns by date range: ${err.message}`);
      throw new Error('Failed to retrieve campaigns by date range');
    }
  }

  /**
   * Create a new campaign
   * @param createDto - The campaign creation data
   * @returns Promise resolving to the created campaign entity
   */
  async createCampaign(createDto: CreateCampaignDto): Promise<CampaignEntity> {
    try {
      // Validate required fields
      if (!createDto.name || !createDto.endDate) {
        throw new Error('Campaign name and end date are required');
      }

      // Validate date logic
      const startDate = createDto.startDate || new Date();
      if (new Date(createDto.endDate) <= startDate) {
        throw new Error('End date must be after start date');
      }

      // Validate target devices array
      if (!createDto.targetDevices || createDto.targetDevices.length === 0) {
        throw new Error('At least one target device is required');
      }

      // Set defaults
      const campaignData: Partial<CampaignEntity> = {
        name: createDto.name.trim(),
        description: createDto.description?.trim(),
        status: createDto.status || 'draft',
        startDate: startDate,
        endDate: new Date(createDto.endDate),
        targetDevices: createDto.targetDevices,
        contentIds: createDto.contentIds || [],
      };

      return await this.campaignRepository.create(campaignData);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating campaign: ${err.message}`);
      throw new Error(`Failed to create campaign: ${err.message}`);
    }
  }

  /**
   * Update an existing campaign
   * @param id - The campaign ID
   * @param updateDto - The campaign update data
   * @returns Promise resolving to the updated campaign entity or null if not found
   */
  async updateCampaign(id: string, updateDto: UpdateCampaignDto): Promise<CampaignEntity | null> {
    try {
      if (!id) {
        throw new Error('Campaign ID is required');
      }

      // Check if campaign exists
      const existingCampaign = await this.campaignRepository.findById(id);
      if (!existingCampaign) {
        return null;
      }

      // Validate date logic if both dates are provided
      if (updateDto.startDate && updateDto.endDate) {
        if (new Date(updateDto.endDate) <= new Date(updateDto.startDate)) {
          throw new Error('End date must be after start date');
        }
      } else if (updateDto.endDate && existingCampaign.startDate) {
        if (new Date(updateDto.endDate) <= existingCampaign.startDate) {
          throw new Error('End date must be after start date');
        }
      } else if (updateDto.startDate && existingCampaign.endDate) {
        if (existingCampaign.endDate <= new Date(updateDto.startDate)) {
          throw new Error('Start date must be before end date');
        }
      }

      // Validate target devices if provided
      if (updateDto.targetDevices && updateDto.targetDevices.length === 0) {
        throw new Error('At least one target device is required');
      }

      // Prepare update data
      const updateData: Partial<CampaignEntity> = {};
      if (updateDto.name !== undefined) updateData.name = updateDto.name.trim();
      if (updateDto.description !== undefined) updateData.description = updateDto.description?.trim();
      if (updateDto.status !== undefined) updateData.status = updateDto.status;
      if (updateDto.startDate !== undefined) updateData.startDate = new Date(updateDto.startDate);
      if (updateDto.endDate !== undefined) updateData.endDate = new Date(updateDto.endDate);
      if (updateDto.targetDevices !== undefined) updateData.targetDevices = updateDto.targetDevices;
      if (updateDto.contentIds !== undefined) updateData.contentIds = updateDto.contentIds;

      return await this.campaignRepository.update(id, updateData);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating campaign ${id}: ${err.message}`);
      throw new Error(`Failed to update campaign: ${err.message}`);
    }
  }

  /**
   * Delete a campaign
   * @param id - The campaign ID
   * @returns Promise resolving to true if successful, false otherwise
   */
  async deleteCampaign(id: string): Promise<boolean> {
    try {
      if (!id) {
        throw new Error('Campaign ID is required');
      }

      // Check if campaign exists
      const existingCampaign = await this.campaignRepository.findById(id);
      if (!existingCampaign) {
        return false;
      }

      return await this.campaignRepository.delete(id);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting campaign ${id}: ${err.message}`);
      throw new Error('Failed to delete campaign');
    }
  }

  /**
   * Add content to a campaign
   * @param campaignId - The campaign ID
   * @param contentId - The content ID to add
   * @returns Promise resolving to the updated campaign entity or null if not found
   */
  async addContent(campaignId: string, contentId: string): Promise<CampaignEntity | null> {
    try {
      if (!campaignId || !contentId) {
        throw new Error('Campaign ID and content ID are required');
      }

      // Check if campaign exists
      const existingCampaign = await this.campaignRepository.findById(campaignId);
      if (!existingCampaign) {
        return null;
      }

      // Check if content is already in the campaign
      if (existingCampaign.contentIds.includes(contentId)) {
        throw new Error('Content is already associated with this campaign');
      }

      return await this.campaignRepository.addContent(campaignId, contentId);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error adding content to campaign ${campaignId}: ${err.message}`);
      throw new Error(`Failed to add content to campaign: ${err.message}`);
    }
  }

  /**
   * Remove content from a campaign
   * @param campaignId - The campaign ID
   * @param contentId - The content ID to remove
   * @returns Promise resolving to the updated campaign entity or null if not found
   */
  async removeContent(campaignId: string, contentId: string): Promise<CampaignEntity | null> {
    try {
      if (!campaignId || !contentId) {
        throw new Error('Campaign ID and content ID are required');
      }

      // Check if campaign exists
      const existingCampaign = await this.campaignRepository.findById(campaignId);
      if (!existingCampaign) {
        return null;
      }

      // Check if content is in the campaign
      if (!existingCampaign.contentIds.includes(contentId)) {
        throw new Error('Content is not associated with this campaign');
      }

      return await this.campaignRepository.removeContent(campaignId, contentId);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error removing content from campaign ${campaignId}: ${err.message}`);
      throw new Error(`Failed to remove content from campaign: ${err.message}`);
    }
  }
}
