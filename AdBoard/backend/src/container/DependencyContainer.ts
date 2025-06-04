/**
 * Dependency Container - Manages application dependencies
 * Follows the Dependency Inversion Principle and Single Responsibility Principle
 */
import { MongoContentRepository } from "../repositories/MongoContentRepository";
import { ContentService } from "../services/ContentService";
import { ContentController } from "../controllers/contentController";
import { ContentRepository } from "../domain/repositories/ContentRepository";

export class DependencyContainer {
  private static instance: DependencyContainer;

  // Repositories
  private _contentRepository?: ContentRepository;

  // Services
  private _contentService?: ContentService;

  // Controllers
  private _contentController?: ContentController;

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

  // Service getters (lazy initialization with dependency injection)
  get contentService(): ContentService {
    if (!this._contentService) {
      this._contentService = new ContentService(this.contentRepository);
    }
    return this._contentService;
  }

  // Controller getters (lazy initialization with dependency injection)
  get contentController(): ContentController {
    if (!this._contentController) {
      this._contentController = new ContentController(this.contentService);
    }
    return this._contentController;
  }
  // Example: Adding new services is simple
  // get deviceService(): DeviceService {
  //   if (!this._deviceService) {
  //     this._deviceService = new DeviceService(this.deviceRepository);
  //   }
  //   return this._deviceService;
  // }

  // Method to get all controllers (for route factory)
  getControllers(): { contentController: ContentController } {
    return {
      contentController: this.contentController,
    };
  }

  // Method to reset container (useful for testing)
  reset(): void {
    this._contentRepository = undefined;
    this._contentService = undefined;
    this._contentController = undefined;
  }
}
