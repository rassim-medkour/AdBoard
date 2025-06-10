/**
 * Dependency Container - Manages application dependencies
 * Follows the Dependency Inversion Principle and Single Responsibility Principle
 */
import { MongoContentRepository } from "../repositories/MongoContentRepository";
import { MongoDeviceRepository } from "../repositories/MongoDeviceRepository";
import { MongoCampaignRepository } from "../repositories/MongoCampaignRepository";
import { MongoUserRepository } from "../repositories/MongoUserRepository";
import { ContentService } from "../services/ContentService";
import { DeviceService } from "../services/DeviceService";
import { CampaignService } from "../services/CampaignService";
import { UserService } from "../services/UserService";
import { ContentController } from "../controllers/contentController";
import { DeviceController } from "../controllers/deviceController";
import { CampaignController } from "../controllers/campaignController";
import { UserController } from "../controllers/userController";
import { ContentRepository } from "../domain/repositories/ContentRepository";
import { DeviceRepository } from "../domain/repositories/DeviceRepository";
import { CampaignRepository } from "../domain/repositories/CampaignRepository";
import { UserRepository } from "../domain/repositories/UserRepository";

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Repositories
  private _contentRepository?: ContentRepository;
  private _deviceRepository?: DeviceRepository;
  private _campaignRepository?: CampaignRepository;
  private _userRepository?: UserRepository;

  // Services
  private _contentService?: ContentService;
  private _deviceService?: DeviceService;
  private _campaignService?: CampaignService;
  private _userService?: UserService;

  // Controllers
  private _contentController?: ContentController;
  private _deviceController?: DeviceController;
  private _campaignController?: CampaignController;
  private _userController?: UserController;

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

  get userRepository(): UserRepository {
    if (!this._userRepository) {
      this._userRepository = new MongoUserRepository();
    }
    return this._userRepository;
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

  get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService(this.userRepository);
    }
    return this._userService;
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
  }

  get userController(): UserController {
    if (!this._userController) {
      this._userController = new UserController(this.userService);
    }
    return this._userController;
  }  // Method to get all controllers (for route factory)
  getControllers(): {
    contentController: ContentController;
    deviceController: DeviceController;
    campaignController: CampaignController;
    userController: UserController;
  } {
    return {
      contentController: this.contentController,
      deviceController: this.deviceController,
      campaignController: this.campaignController,
      userController: this.userController,
    };
  }
  // Method to reset container (useful for testing)
  reset(): void {
    this._contentRepository = undefined;
    this._deviceRepository = undefined;
    this._campaignRepository = undefined;
    this._userRepository = undefined;
    this._contentService = undefined;
    this._deviceService = undefined;
    this._campaignService = undefined;
    this._userService = undefined;
    this._contentController = undefined;
    this._deviceController = undefined;
    this._campaignController = undefined;
    this._userController = undefined;
  }
}
