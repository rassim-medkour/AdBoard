import { Model } from 'mongoose';
import { Campaign } from '../models';
import { CampaignEntity } from '../domain/entities/CampaignEntity';
import { CampaignRepository } from '../domain/repositories/CampaignRepository';

/**
 * MongoDB implementation of the CampaignRepository interface
 */
export class MongoCampaignRepository implements CampaignRepository {
  private campaignModel: Model<any>;

  /**
   * Creates a new MongoCampaignRepository
   * @param campaignModel - The Mongoose model to use (defaults to Campaign)
   */
  constructor(campaignModel = Campaign) {
    this.campaignModel = campaignModel;
  }

  /**
   * Converts a Mongoose document to a campaign entity
   * @param doc - The Mongoose document
   * @returns The campaign entity or null if the document is null
   */
  private toEntity(doc: any): CampaignEntity | null {
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      status: doc.status,
      startDate: doc.startDate,
      endDate: doc.endDate,
      targetDevices: doc.targetDevices,
      contentIds: doc.contentIds,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Finds all campaigns
   * @returns Promise resolving to an array of campaign entities
   */
  async findAll(): Promise<CampaignEntity[]> {
    const campaigns = await this.campaignModel.find();
    return campaigns
      .map((campaign) => this.toEntity(campaign))
      .filter((campaign): campaign is CampaignEntity => campaign !== null);
  }

  /**
   * Finds a campaign by ID
   * @param id - The campaign ID
   * @returns Promise resolving to the campaign entity or null if not found
   */
  async findById(id: string): Promise<CampaignEntity | null> {
    const campaign = await this.campaignModel.findById(id);
    return this.toEntity(campaign);
  }

  /**
   * Finds campaigns by status
   * @param status - The status to filter by
   * @returns Promise resolving to an array of campaign entities
   */
  async findByStatus(status: 'draft' | 'active' | 'paused' | 'completed'): Promise<CampaignEntity[]> {
    const campaigns = await this.campaignModel.find({ status });
    return campaigns
      .map((campaign) => this.toEntity(campaign))
      .filter((campaign): campaign is CampaignEntity => campaign !== null);
  }

  /**
   * Finds active campaigns for a device
   * @param deviceId - The device ID
   * @returns Promise resolving to an array of campaign entities
   */
  async findActiveForDevice(deviceId: string): Promise<CampaignEntity[]> {
    const campaigns = await this.campaignModel.find({
      status: 'active',
      targetDevices: deviceId,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });
    return campaigns
      .map((campaign) => this.toEntity(campaign))
      .filter((campaign): campaign is CampaignEntity => campaign !== null);
  }

  /**
   * Finds campaigns by date range
   * @param startDate - The start date
   * @param endDate - The end date
   * @returns Promise resolving to an array of campaign entities
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<CampaignEntity[]> {
    const campaigns = await this.campaignModel.find({
      $or: [
        {
          startDate: { $gte: startDate, $lte: endDate }
        },
        {
          endDate: { $gte: startDate, $lte: endDate }
        },
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate }
        }
      ]
    });
    return campaigns
      .map((campaign) => this.toEntity(campaign))
      .filter((campaign): campaign is CampaignEntity => campaign !== null);
  }

  /**
   * Adds content to a campaign
   * @param campaignId - The campaign ID
   * @param contentId - The content ID to add
   * @returns Promise resolving to the updated campaign or null if not found
   */
  async addContent(campaignId: string, contentId: string): Promise<CampaignEntity | null> {
    const updatedCampaign = await this.campaignModel.findByIdAndUpdate(
      campaignId,
      { $addToSet: { contentIds: contentId } },
      { new: true }
    );
    return this.toEntity(updatedCampaign);
  }

  /**
   * Removes content from a campaign
   * @param campaignId - The campaign ID
   * @param contentId - The content ID to remove
   * @returns Promise resolving to the updated campaign or null if not found
   */
  async removeContent(campaignId: string, contentId: string): Promise<CampaignEntity | null> {
    const updatedCampaign = await this.campaignModel.findByIdAndUpdate(
      campaignId,
      { $pull: { contentIds: contentId } },
      { new: true }
    );
    return this.toEntity(updatedCampaign);
  }

  /**
   * Creates a new campaign
   * @param data - The campaign data
   * @returns Promise resolving to the created campaign entity
   */
  async create(data: Partial<CampaignEntity>): Promise<CampaignEntity> {
    const campaign = new this.campaignModel(data);
    const savedCampaign = await campaign.save();
    const entity = this.toEntity(savedCampaign);
    if (!entity) {
      throw new Error("Failed to create campaign: Entity conversion returned null");
    }
    return entity;
  }

  /**
   * Updates an existing campaign
   * @param id - The campaign ID
   * @param data - The updated campaign data
   * @returns Promise resolving to the updated campaign entity or null if not found
   */
  async update(
    id: string,
    data: Partial<CampaignEntity>
  ): Promise<CampaignEntity | null> {
    const updatedCampaign = await this.campaignModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    return this.toEntity(updatedCampaign);
  }

  /**
   * Deletes a campaign
   * @param id - The campaign ID
   * @returns Promise resolving to true if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.campaignModel.findByIdAndDelete(id);
    return !!result;
  }
}
