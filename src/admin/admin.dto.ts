// ---------------------------------------------------
// DTO: src/user-data/dto/user-data.dto.ts
// ---------------------------------------------------
// This file creates Data Transfer Object (DTO) types inferred directly
// from the Zod schemas. This avoids code duplication and keeps your
// types and validation rules perfectly in sync.

import { z } from 'zod';
import { createUserDataSchema, queryUserDataSchema, updateUserDataSchema } from './admin.schema';

// Assuming schema file location

/**
 * The DTO type for creating a new UserData record.
 * Inferred from the createUserDataSchema for compile-time safety.
 */
export type CreateUserDataDto = z.infer<typeof createUserDataSchema>;

/**
 * The DTO type for updating an existing UserData record.
 * Inferred from the updateUserDataSchema. All properties are optional.
 */
export type UpdateUserDataDto = z.infer<typeof updateUserDataSchema>;

/**
 * The DTO type for handling query parameters on GET requests.
 * Inferred from the queryUserDataSchema for validating pagination, sorting, etc.
 */
export type QueryUserDataDto = z.infer<typeof queryUserDataSchema>;
