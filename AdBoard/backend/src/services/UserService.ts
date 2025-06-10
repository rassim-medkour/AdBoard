import { UserRepository } from "../domain/repositories/UserRepository";
import { UserEntity } from "../domain/entities/UserEntity";
import { logger } from "../config/logger";
import bcrypt from "bcrypt";

/**
 * UserService handles all user-related business logic
 */
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Get all users (excluding passwords)
   */
  async getAllUsers(): Promise<Omit<UserEntity, 'password'>[]> {
    try {
      const users = await this.userRepository.findAll();
      return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting all users: ${err.message}`);
      throw new Error("Failed to retrieve users");
    }
  }

  /**
   * Get a user by ID (excluding password)
   */
  async getUserById(id: string): Promise<Omit<UserEntity, 'password'> | null> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return null;
      }
      
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error getting user by ID ${id}: ${err.message}`);
      throw new Error("Failed to retrieve user");
    }
  }
  /**
   * Create a new user
   */
  async createUser(userData: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Omit<UserEntity, 'password'>> {
    try {
      // Check if user already exists by username
      const existingByUsername = await this.userRepository.findByUsername(userData.username);
      if (existingByUsername) {
        throw new Error("Username already exists");
      }

      // Check if user already exists by email
      const existingByEmail = await this.userRepository.findByEmail(userData.email);
      if (existingByEmail) {
        throw new Error("Email already exists");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user entity
      const userEntity: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'> = {
        ...userData,
        password: hashedPassword,
        role: userData.role || 'user'
      };

      const createdUser = await this.userRepository.create(userEntity);
      
      // Return user without password
      const { password, ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error creating user: ${err.message}`);
      
      if (err.message.includes("already exists")) {
        throw err;
      }
      
      throw new Error("Failed to create user");
    }
  }
  /**
   * Update a user
   */
  async updateUser(id: string, userData: Partial<Omit<UserEntity, 'id' | 'password' | 'createdAt' | 'updatedAt'>>): Promise<Omit<UserEntity, 'password'> | null> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return null;
      }

      // Check if username conflicts with other users
      if (userData.username) {
        const conflictByUsername = await this.userRepository.findByUsername(userData.username);
        if (conflictByUsername && conflictByUsername.id !== id) {
          throw new Error("Username already exists");
        }
      }

      // Check if email conflicts with other users
      if (userData.email) {
        const conflictByEmail = await this.userRepository.findByEmail(userData.email);
        if (conflictByEmail && conflictByEmail.id !== id) {
          throw new Error("Email already exists");
        }
      }

      const updatedUser = await this.userRepository.update(id, userData);
      if (!updatedUser) {
        return null;
      }

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error updating user ${id}: ${err.message}`);
      
      if (err.message.includes("already exists")) {
        throw err;
      }
      
      throw new Error("Failed to update user");
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const deleted = await this.userRepository.delete(id);
      return deleted;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error deleting user ${id}: ${err.message}`);
      throw new Error("Failed to delete user");
    }
  }
  /**
   * Check if a user exists by username or email
   */
  async userExists(username: string, email: string): Promise<boolean> {
    try {
      // Check if user exists by username
      const userByUsername = await this.userRepository.findByUsername(username);
      if (userByUsername) {
        return true;
      }

      // Check if user exists by email
      const userByEmail = await this.userRepository.findByEmail(email);
      return !!userByEmail;
    } catch (error) {
      const err = error as Error;
      logger.error(`Error checking user existence: ${err.message}`);
      throw new Error("Failed to check user existence");
    }
  }
}
