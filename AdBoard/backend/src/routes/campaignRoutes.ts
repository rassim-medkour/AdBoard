import express from "express";
import * as campaignController from "../controllers/campaignController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Campaigns
 *   description: API for managing advertising campaigns
 */

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaigns]
 *     responses:
 *       200:
 *         description: List of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 *       500:
 *         description: Server error
 */
router.get("/", campaignController.getAllCampaigns);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaigns]
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
 *       404:
 *         description: Campaign not found
 *       500:
 *         description: Server error
 */
router.get("/:id", campaignController.getCampaignById);

/**
 * @swagger
 * /api/campaigns/device/{deviceId}:
 *   get:
 *     summary: Get campaigns for a specific device
 *     tags: [Campaigns]
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
 *       500:
 *         description: Server error
 */
router.get("/device/:deviceId", campaignController.getDeviceCampaigns);

/**
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
 *               - status
 *               - targetDevices
 *             properties:
 *               name:
 *                 type: string
 *                 description: Campaign name
 *               description:
 *                 type: string
 *                 description: Campaign description
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the campaign
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the campaign
 *               status:
 *                 type: string
 *                 enum: [draft, active, paused, completed]
 *                 description: Campaign status
 *               targetDevices:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of device IDs to target
 *               contents:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of content IDs to include in the campaign
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", campaignController.createCampaign);

/**
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
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the campaign
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the campaign
 *               status:
 *                 type: string
 *                 enum: [draft, active, paused, completed]
 *                 description: Campaign status
 *               targetDevices:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of device IDs to target
 *               contents:
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
router.put("/:id", campaignController.updateCampaign);

/**
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
router.delete("/:id", campaignController.deleteCampaign);

export default router;
