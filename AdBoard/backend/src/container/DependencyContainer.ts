/**
 * Dependency Container - Manages application dependencies
 * Follows the Dependency Inversion Principle and Single Responsibility Principle
 */
import { MongoContentRepository } from "../repositories/MongoContentRepository";
import { MongoDeviceRepository } from "../repositories/MongoDeviceRepository";
import { MongoCampaignRepository } from "../repositories/MongoCampaignRepository";
import { ContentService } from "../services/ContentService";
import { DeviceService } from "../services/DeviceService";
import { CampaignService } from "../services/CampaignService";
import { ContentController } from "../controllers/contentController";
import { DeviceController } from "../controllers/deviceController";
import { CampaignController } from "../controllers/campaignController";
import { ContentRepository } from "../domain/repositories/ContentRepository";
import { DeviceRepository } from "../domain/repositories/DeviceRepository";
import { CampaignRepository } from "../domain/repositories/CampaignRepository";

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Repositories
  private _contentRepository?: ContentRepository;
  private _deviceRepository?: DeviceRepository;
  private _campaignRepository?: CampaignRepository;

  // Services
  private _contentService?: ContentService;
  private _deviceService?: DeviceService;
  private _campaignService?: CampaignService;

  // Controllers
  private _contentController?: ContentController;
  private _deviceController?: DeviceController;
  private _campaignController?: CampaignController;

  private constructor() {}

  static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }
  // Repository getters (lazy initialization)
  get contentRepository(): ContentRepository {
    if (!this._contentRepository) {
      this._contentRepository = new MongoContentRepository();
    }
    return this._contentRepository;
  }

  get deviceRepository(): DeviceRepository {
    if (!this._deviceRepository) {
      this._deviceRepository = new MongoDeviceRepository();
    }
    return this._deviceRepository;
  }

  get campaignRepository(): CampaignRepository {
    if (!this._campaignRepository) {
      this._campaignRepository = new MongoCampaignRepository();
    }
    return this._campaignRepository;
  }
  // Service getters (lazy initialization with dependency injection)
  get contentService(): ContentService {
    if (!this._contentService) {
      this._contentService = new ContentService(this.contentRepository);
    }
    return this._contentService;
  }

  get deviceService(): DeviceService {
    if (!this._deviceService) {
      this._deviceService = new DeviceService(this.deviceRepository);
    }
    return this._deviceService;
  }

  get campaignService(): CampaignService {
    if (!this._campaignService) {
      this._campaignService = new CampaignService(this.campaignRepository);
    }
    return this._campaignService;
  }
  // Controller getters (lazy initialization with dependency injection)
  get contentController(): ContentController {
    if (!this._contentController) {
      this._contentController = new ContentController(this.contentService);
    }
    return this._contentController;
  }

  get deviceController(): DeviceController {
    if (!this._deviceController) {
      this._deviceController = new DeviceController(this.deviceService);
    }
    return this._deviceController;
  }

  get campaignController(): CampaignController {
    if (!this._campaignController) {
      this._campaignController = new CampaignController(this.campaignService);
    }
    return this._campaignController;
  }  // Method to get all controllers (for route factory)
  getControllers(): {
    contentController: ContentController;
    deviceController: DeviceController;
    campaignController: CampaignController;
  } {
    return {
      contentController: this.contentController,
      deviceController: this.deviceController,
      campaignController: this.campaignController,
    };
  }
  // Method to reset container (useful for testing)
  reset(): void {
    this._contentRepository = undefined;
    this._deviceRepository = undefined;
    this._campaignRepository = undefined;
    this._contentService = undefined;
    this._deviceService = undefined;
    this._campaignService = undefined;
    this._contentController = undefined;
    this._deviceController = undefined;
    this._campaignController = undefined;
  }
}
