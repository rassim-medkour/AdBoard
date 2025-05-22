/**
 * Base repository interface that defines common CRUD operations
 * @template T - The entity type this repository manages
 * @template ID - The type of entity ID (typically string)
 */
export interface BaseRepository<T, ID = string> {
  /**
   * Find all entities
   * @returns Promise resolving to an array of entities
   */
  findAll(): Promise<T[]>;
  
  /**
   * Find entity by ID
   * @param id - The entity ID
   * @returns Promise resolving to the entity or null if not found
   */
  findById(id: ID): Promise<T | null>;
  
  /**
   * Create a new entity
   * @param data - The entity data
   * @returns Promise resolving to the created entity
   */
  create(data: Partial<T>): Promise<T>;
  
  /**
   * Update an existing entity
   * @param id - The entity ID
   * @param data - The updated entity data
   * @returns Promise resolving to the updated entity or null if not found
   */
  update(id: ID, data: Partial<T>): Promise<T | null>;
  
  /**
   * Delete an entity
   * @param id - The entity ID
   * @returns Promise resolving to true if successful, false otherwise
   */
  delete(id: ID): Promise<boolean>;
}
