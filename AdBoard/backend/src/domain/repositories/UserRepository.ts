import { BaseRepository } from "./BaseRepository";
import {
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
} from "../entities/UserEntity";

/**
 * User repository interface
 * Extends the base repository with user-specific operations
 */
export interface UserRepository extends BaseRepository<UserEntity> {
  /**
   * Find a user by username
   * @param username - The username to search for
   * @returns Promise resolving to the user or null if not found
   */
  findByUsername(username: string): Promise<UserEntity | null>;

  /**
   * Find a user by email
   * @param email - The email to search for
   * @returns Promise resolving to the user or null if not found
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Find a user by username or email (used for login)
   * @param identifier - The username or email to search for
   * @returns Promise resolving to the user or null if not found
   */
  findByUsernameOrEmail(identifier: string): Promise<UserEntity | null>;

  /**
   * Update a user with validation
   * @param id - The user ID
   * @param userData - The updated user data
   * @returns Promise resolving to the updated user or null if not found
   */
  updateUser(id: string, userData: UpdateUserDto): Promise<UserEntity | null>;
}
