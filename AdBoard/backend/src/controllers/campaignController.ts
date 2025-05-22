import { Request, Response } from "express";
import { Campaign, Device } from "../models";
import { logger } from "../config/logger";
import mongoose from "mongoose";

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
export const getAllCampaigns = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const campaigns = await Campaign.find().populate("contents");
    return res.status(200).json(campaigns);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting campaigns: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });  }
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
export const getCampaignById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "contents"
    );
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    return res.status(200).json(campaign);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting campaign: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });  }
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
 *               - status
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
 *                 description: Campaign status
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
 *               contents:
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
export const createCampaign = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      targetDevices,
      contents,
    } = req.body;

    // Validate target devices exist
    if (targetDevices && targetDevices.length > 0) {
      for (const deviceId of targetDevices) {
        const device = await Device.findOne({ deviceId });
        if (!device) {
          return res.status(400).json({
            message: `Target device not found: ${deviceId}`,
          });
        }
      }
    }

    const campaign = new Campaign({
      name,
      description,
      status: status || "draft",
      startDate: startDate || new Date(),
      endDate,
      targetDevices: targetDevices || [],
      contents: contents || [],
    });

    await campaign.save();
    return res.status(201).json(campaign);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error creating campaign: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });  }
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
 *               contents:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of content IDs included in this campaign
 *     responses:
 *       200:
 *         description: Campaign updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
export const updateCampaign = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      name,
      description,
      status,
      startDate,
      endDate,
      targetDevices,
      contents,
    } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Validate target devices exist
    if (targetDevices && targetDevices.length > 0) {
      for (const deviceId of targetDevices) {
        const device = await Device.findOne({ deviceId });
        if (!device) {
          return res.status(400).json({
            message: `Target device not found: ${deviceId}`,
          });
        }
      }
    }

    if (name) campaign.name = name;
    if (description) campaign.description = description;
    if (status)
      campaign.status = status as "draft" | "active" | "paused" | "completed";
    if (startDate) campaign.startDate = new Date(startDate);
    if (endDate) campaign.endDate = new Date(endDate);
    if (targetDevices) campaign.targetDevices = targetDevices;
    if (contents)
      campaign.contents = contents.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      );

    await campaign.save();

    const updatedCampaign = await Campaign.findById(campaign._id).populate(
      "contents"
    );
    return res.status(200).json(updatedCampaign);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error updating campaign: ${err.message}`);
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
export const deleteCampaign = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    return res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    const err = error as Error;
    logger.error(`Error deleting campaign: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });  }
};

/**
 * Get campaigns for a device
 * @swagger
 * /api/campaigns/device/{deviceId}:
 *   get:
 *     summary: Get all active campaigns for a device
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
export const getDeviceCampaigns = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { deviceId } = req.params;

    // Find device to verify it exists
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Find active campaigns targeting this device
    const currentDate = new Date();
    const campaigns = await Campaign.find({
      targetDevices: deviceId,
      status: "active",
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).populate("contents");

    return res.status(200).json(campaigns);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error getting device campaigns: ${err.message}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};
