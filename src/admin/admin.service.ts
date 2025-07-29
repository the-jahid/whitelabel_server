import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IUserData } from './admin.interface';
import { CreateUserDataDto, QueryUserDataDto, UpdateUserDataDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new UserData record after validating the user's existence.
   * @param createUserDataDto - The data for the new record.
   * @returns The newly created UserData record.
   */
  async create(createUserDataDto: CreateUserDataDto): Promise<IUserData> {
    const { userId, campaignName, outboundId, bearerToken } = createUserDataDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException(`User with ID "${userId}" not found.`);
    }

    return this._createUserData(userId, campaignName, outboundId, bearerToken);
  }

  /**
   * Creates a new UserData record by finding the user via their email.
   * @param data - The data containing the user's email and the new credentials.
   * @returns The newly created UserData record.
   */
  async createByEmail(data: {
    email: string;
    campaignName: string;
    outboundId: string;
    bearerToken: string;
  }): Promise<IUserData> {
    const { email, campaignName, outboundId, bearerToken } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found.`);
    }

    return this._createUserData(user.id, campaignName, outboundId, bearerToken);
  }

  /**
   * Private helper method to handle the actual UserData creation.
   */
  private async _createUserData(
    userId: string,
    campaignName: string,
    outboundId: string,
    bearerToken: string,
  ): Promise<IUserData> {
    try {
      return await this.prisma.userData.create({
        data: {
          campaignName,
          outboundId,
          bearerToken,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('A record with this data already exists for the user.');
      }
      throw error;
    }
  }

  /**
   * Retrieves UserData records based on filtering, pagination, and sorting criteria.
   * @param query - The DTO containing all query parameters.
   * @returns A list of UserData records.
   */
  async findAll(query: QueryUserDataDto): Promise<IUserData[]> {
    const { page, limit, sortBy, sortOrder, userId, campaignName } = query;

    const allowedSortByFields = ['createdAt', 'updatedAt', 'outboundId', 'campaignName'];
    if (sortBy && !allowedSortByFields.includes(sortBy)) {
      throw new BadRequestException(`Invalid sortBy field. Must be one of: ${allowedSortByFields.join(', ')}`);
    }

    const whereClause: Prisma.UserDataWhereInput = {};
    if (userId) {
      whereClause.userId = userId;
    }
    if (campaignName) {
      whereClause.campaignName = {
        contains: campaignName,
        mode: 'insensitive',
      };
    }

    return this.prisma.userData.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder.toLowerCase(),
      },
    });
  }

  /**
   * Finds a single UserData record by its ID.
   * @param id - The UUID of the UserData record.
   * @returns The found UserData record.
   */
  async findOne(id: string): Promise<IUserData> {
    const userData = await this.prisma.userData.findUnique({
      where: { id },
    });
    if (!userData) {
      throw new NotFoundException(`UserData record with ID "${id}" not found.`);
    }
    return userData;
  }

  /**
   * Counts the total number of users in the database.
   * @returns The total number of users.
   */
  async countAllUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  /**
   * Updates an existing UserData record.
   * @param id - The UUID of the record to update.
   * @param updateUserDataDto - The data to update.
   * @returns The updated UserData record.
   */
  async update(id: string, updateUserDataDto: UpdateUserDataDto): Promise<IUserData> {
    await this.findOne(id); // Reuse findOne to check for existence
    return this.prisma.userData.update({
      where: { id },
      data: updateUserDataDto,
    });
  }

  /**
   * Deletes a UserData record by its ID.
   * @param id - The UUID of the record to delete.
   * @returns The deleted UserData record.
   */
  async remove(id: string): Promise<IUserData> {
    await this.findOne(id); // Reuse findOne to check for existence
    return this.prisma.userData.delete({
      where: { id },
    });
  }
}
