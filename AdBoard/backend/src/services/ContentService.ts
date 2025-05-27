import { ContentRepository } from "../domain/repositories/ContentRepository";

export class ContentService {
  private contentRepository: ContentRepository;

  constructor(contentRepository: ContentRepository) {
    this.contentRepository = contentRepository;
  }
}
