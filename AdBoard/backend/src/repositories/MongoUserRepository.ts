import { Model } from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models";
import { UserEntity, UpdateUserDto } from "../domain/entities/UserEntity";
import { UserRepository } from "../domain/repositories/UserRepository";

/**
 * MongoDB implementation of the User repository
 * Handles the persistence and retrieval of User entities using Mongoose
 */
export class MongoUserRepository implements UserRepository {
  private userModel: Model<any>;

  /**
   * Constructor that accepts a Mongoose model
   * @param userModel - The Mongoose User model (defaults to the global User model)
   */
  constructor(userModel = User) {
    this.userModel = userModel;
  }

  /**
   * Converts a Mongoose document to a domain entity
   * @param doc - The Mongoose document
   * @returns The domain entity or null if doc is null
   */
  private toEntity(doc: any): UserEntity | null {
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      password: doc.password, // Note: This includes password for internal use
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Finds all users
   * @returns Promise resolving to an array of user entities
   */
  async findAll(): Promise<UserEntity[]> {
    const users = await this.userModel.find();
    return users
      .map((user) => this.toEntity(user))
      .filter((user): user is UserEntity => user !== null);
  }

  /**
   * Finds a user by ID
   * @param id - The user ID
   * @returns Promise resolving to the user entity or null if not found
   */
  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id);
    return this.toEntity(user);
  }

  /**
   * Finds a user by username
   * @param username - The username to search for
   * @returns Promise resolving to the user entity or null if not found
   */
  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ username });
    return this.toEntity(user);
  }

  /**
   * Finds a user by email
   * @param email - The email to search for
   * @returns Promise resolving to the user entity or null if not found
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email });
    return this.toEntity(user);
  }

  /**
   * Finds a user by username or email
   * @param identifier - The username or email to search for
   * @returns Promise resolving to the user entity or null if not found
   */
  async findByUsernameOrEmail(identifier: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    return this.toEntity(user);
  }

  /**
   * Creates a new user
   * @param data - The user data
   * @returns Promise resolving to the created user entity
   */
  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = new this.userModel(data);
    const savedUser = await user.save();
    const entity = this.toEntity(savedUser);
    if (!entity) {
      throw new Error("Failed to create user: Entity conversion returned null");
    }
    return entity;
  }

  /**
   * Updates an existing user
   * @param id - The user ID
   * @param data - The updated user data
   * @returns Promise resolving to the updated user entity or null if not found
   */
  async update(
    id: string,
    data: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return this.toEntity(updatedUser);
  }

  /**
   * Updates a user with optional password hashing
   * @param id - The user ID
   * @param userData - The updated user data
   * @returns Promise resolving to the updated user entity or null if not found
   */
  async updateUser(
    id: string,
    userData: UpdateUserDto
  ): Promise<UserEntity | null> {
    // Create a copy of the data to avoid modifying the input
    const updateData = { ...userData };

    // If password is provided, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return this.toEntity(updatedUser);
  }

  /**
   * Deletes a user
   * @param id - The user ID
   * @returns Promise resolving to true if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id);
    return !!result;
  }
}
