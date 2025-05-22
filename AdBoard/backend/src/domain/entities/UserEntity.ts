import { BaseEntity } from './BaseEntity';

/**
 * User domain entity
 * Represents a user in the system with authentication and authorization capabilities
 */
export interface UserEntity extends BaseEntity {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

/**
 * User creation input DTO
 * Used when creating a new user (password not hashed yet)
 */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

/**
 * User update input DTO
 * All fields are optional for partial updates
 */
export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'user';
}

/**
 * User response DTO
 * Used when returning user data to clients (no password)
 */
export interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
