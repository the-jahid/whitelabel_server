import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Adjust path if needed

@Module({
  imports: [
    PrismaModule, // Import PrismaModule to make PrismaService available for injection
  ],
  controllers: [AdminController], // Declare the controller for this module
  providers: [AdminService], // Provide the service for this module
})
export class AdminModule {}
