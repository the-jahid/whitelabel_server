import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserDataDto, QueryUserDataDto, UpdateUserDataDto } from './admin.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// This DTO now includes validation for the campaignName property.
class CreateByEmailDto {
  @IsEmail({}, { message: 'A valid email address is required.' })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  campaignName: string;

  @IsString()
  @IsNotEmpty()
  outboundId: string;

  @IsString()
  @IsNotEmpty()
  bearerToken: string;
}

@ApiTags('Admin - User Data Management')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('user-data')
  @ApiOperation({ summary: 'Create a new UserData record for a user' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data or user not found.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createUserDataDto: CreateUserDataDto) {
    return this.adminService.create(createUserDataDto);
  }

  @Post('user-data/by-email')
  @ApiOperation({ summary: 'Create a new UserData record by user email' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 404, description: 'User with the specified email not found.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createByEmail(@Body() createByEmailDto: CreateByEmailDto) {
    return this.adminService.createByEmail(createByEmailDto);
  }

  @Get('user-data')
  @ApiOperation({ summary: 'Retrieve all UserData records with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user ID' })
  @ApiQuery({ name: 'campaignName', required: false, type: String, description: 'Filter by campaign name (partial match)' })
  @ApiResponse({ status: 200, description: 'A list of UserData records.' })
  findAll(@Query(new ValidationPipe({ transform: true })) query: QueryUserDataDto) {
    return this.adminService.findAll(query);
  }
  
  @Get('users/count')
  @ApiOperation({ summary: 'Get the total count of all users' })
  @ApiResponse({ status: 200, description: 'The total number of users.'})
  countAllUsers() {
    return this.adminService.countAllUsers();
  }

  @Get('user-data/:id')
  @ApiOperation({ summary: 'Get a specific UserData record by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'The UUID of the UserData record' })
  @ApiResponse({ status: 200, description: 'The requested UserData record.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.findOne(id);
  }

  @Patch('user-data/:id')
  @ApiOperation({ summary: 'Update a UserData record' })
  @ApiParam({ name: 'id', type: 'string', description: 'The UUID of the UserData record to update' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDataDto: UpdateUserDataDto) {
    return this.adminService.update(id, updateUserDataDto);
  }

  @Delete('user-data/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a UserData record' })
  @ApiParam({ name: 'id', type: 'string', description: 'The UUID of the UserData record to delete' })
  @ApiResponse({ status: 204, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Record not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.remove(id);
  }
}
