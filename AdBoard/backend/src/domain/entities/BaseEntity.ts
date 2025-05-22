/**
 * Base entity interface that all domain entities will implement
 * This provides common properties for all entities
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
