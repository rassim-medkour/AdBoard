import express from "express";
import * as campaignController from "../controllers/campaignController";

const router = express.Router();

// GET all campaigns
router.get("/", campaignController.getAllCampaigns);

// GET campaign by ID
router.get("/:id", campaignController.getCampaignById);

// GET campaigns for a device
router.get("/device/:deviceId", campaignController.getDeviceCampaigns);

// POST create campaign
router.post("/", campaignController.createCampaign);

// PUT update campaign
router.put("/:id", campaignController.updateCampaign);

// DELETE campaign
router.delete("/:id", campaignController.deleteCampaign);

export default router;
