import { Request, Response } from "express";
import { logger } from "../config/logger";
import { CampaignService } from "../services/CampaignService";
import { CreateCampaignDto, UpdateCampaignDto } from "../domain/entities/CampaignEntity";

/**
 * Campaign controller for handling HTTP requests
 * Uses CampaignService for business logic
 */
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  /**
   * Get all campaigns
   * @swagger
   * /api/campaigns:
   *   get:
   *     summary: Get all campaigns
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of campaigns
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Campaign'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  getAllCampaigns = async (req: Request, res: Response): Promise<Response> => {
    try {
      const campaigns = await this.campaignService.getAllCampaigns();
      return res.status(200).json(campaigns);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting campaigns: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Get campaign by ID
   * @swagger
   * /api/campaigns/{id}:
   *   get:
   *     summary: Get campaign by ID
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Campaign ID
   *     responses:
   *       200:
   *         description: Campaign details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Campaign not found
   *       500:
   *         description: Server error
   */
  getCampaignById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const campaign = await this.campaignService.getCampaignById(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      return res.status(200).json(campaign);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting campaign: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Get campaigns by status
   * @swagger
   * /api/campaigns/status/{status}:
   *   get:
   *     summary: Get campaigns by status
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: status
   *         required: true
   *         schema:
   *           type: string
   *           enum: [draft, active, paused, completed]
   *         description: Campaign status
   *     responses:
   *       200:
   *         description: List of campaigns with specified status
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Campaign'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  getCampaignsByStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const status = req.params.status as 'draft' | 'active' | 'paused' | 'completed';
      const campaigns = await this.campaignService.getCampaignsByStatus(status);
      return res.status(200).json(campaigns);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting campaigns by status: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Get active campaigns for a device
   * @swagger
   * /api/campaigns/device/{deviceId}:
   *   get:
   *     summary: Get active campaigns for a device
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: deviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: Device ID
   *     responses:
   *       200:
   *         description: List of campaigns for the device
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Campaign'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  getDeviceCampaigns = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { deviceId } = req.params;
      const campaigns = await this.campaignService.getActiveForDevice(deviceId);
      return res.status(200).json(campaigns);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting device campaigns: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Create new campaign
   * @swagger
   * /api/campaigns:
   *   post:
   *     summary: Create a new campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - startDate
   *               - endDate
   *               - targetDevices
   *             properties:
   *               name:
   *                 type: string
   *                 description: Campaign name
   *               description:
   *                 type: string
   *                 description: Campaign description
   *               status:
   *                 type: string
   *                 enum: [draft, active, paused, completed]
   *                 description: Campaign status (defaults to draft)
   *               startDate:
   *                 type: string
   *                 format: date-time
   *                 description: Campaign start date
   *               endDate:
   *                 type: string
   *                 format: date-time
   *                 description: Campaign end date
   *               targetDevices:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of device IDs targeted by this campaign
   *               contentIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Array of content IDs included in this campaign
   *     responses:
   *       201:
   *         description: Campaign created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       400:
   *         description: Invalid input
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  createCampaign = async (req: Request, res: Response): Promise<Response> => {
    try {
      const createDto: CreateCampaignDto = req.body;
      const campaign = await this.campaignService.createCampaign(createDto);
      return res.status(201).json(campaign);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating campaign: ${err.message}`);
      
      // Check if it's a validation error
      if (err.message.includes('required') || err.message.includes('must be')) {
        return res.status(400).json({ message: err.message });
      }
      
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Update campaign
   * @swagger
   * /api/campaigns/{id}:
   *   put:
   *     summary: Update a campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Campaign ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Campaign name
   *               description:
   *                 type: string
   *                 description: Campaign description
   *               status:
   *                 type: string
   *                 enum: [draft, active, paused, completed]
   *                 description: Campaign status
   *               startDate:
   *                 type: string
   *                 format: date-time
   *                 description: Start date of the campaign
   *               endDate:
   *                 type: string
   *                 format: date-time
   *                 description: End date of the campaign
   *               targetDevices:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: List of device IDs to target
   *               contentIds:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: List of content IDs to include in the campaign
   *     responses:
   *       200:
   *         description: Campaign updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       400:
   *         description: Invalid request data
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Campaign not found
   *       500:
   *         description: Server error
   */
  updateCampaign = async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateDto: UpdateCampaignDto = req.body;
      const campaign = await this.campaignService.updateCampaign(req.params.id, updateDto);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      return res.status(200).json(campaign);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating campaign: ${err.message}`);
      
      // Check if it's a validation error
      if (err.message.includes('required') || err.message.includes('must be')) {
        return res.status(400).json({ message: err.message });
      }
      
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Delete campaign
   * @swagger
   * /api/campaigns/{id}:
   *   delete:
   *     summary: Delete a campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Campaign ID
   *     responses:
   *       200:
   *         description: Campaign deleted successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Campaign not found
   *       500:
   *         description: Server error
   */
  deleteCampaign = async (req: Request, res: Response): Promise<Response> => {
    try {
      const success = await this.campaignService.deleteCampaign(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      return res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting campaign: ${err.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Add content to campaign
   * @swagger
   * /api/campaigns/{id}/content/{contentId}:
   *   post:
   *     summary: Add content to a campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Campaign ID
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *         description: Content ID to add
   *     responses:
   *       200:
   *         description: Content added to campaign successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       400:
   *         description: Invalid request or content already exists
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Campaign not found
   *       500:
   *         description: Server error
   */
  addContent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id: campaignId, contentId } = req.params;
      const campaign = await this.campaignService.addContent(campaignId, contentId);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      return res.status(200).json(campaign);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error adding content to campaign: ${err.message}`);
      
      if (err.message.includes('already associated')) {
        return res.status(400).json({ message: err.message });
      }
      
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  /**
   * Remove content from campaign
   * @swagger
   * /api/campaigns/{id}/content/{contentId}:
   *   delete:
   *     summary: Remove content from a campaign
   *     tags: [Campaigns]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Campaign ID
   *       - in: path
   *         name: contentId
   *         required: true
   *         schema:
   *           type: string
   *         description: Content ID to remove
   *     responses:
   *       200:
   *         description: Content removed from campaign successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Campaign'
   *       400:
   *         description: Content not associated with campaign
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Campaign not found
   *       500:
   *         description: Server error
   */
  removeContent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id: campaignId, contentId } = req.params;
      const campaign = await this.campaignService.removeContent(campaignId, contentId);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      return res.status(200).json(campaign);
    } catch (error) {
      const err = error as Error;
      logger.error(`Error removing content from campaign: ${err.message}`);
      
      if (err.message.includes('not associated')) {
        return res.status(400).json({ message: err.message });
      }
      
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
