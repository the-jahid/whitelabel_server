// ---------------------------------------------------
// Interface: src/admin/admin.interface.ts
// ---------------------------------------------------
// This file defines the TypeScript interface for a UserData object.

export interface IUserData {
  id: string;
  campaignName: string; // <-- Added
  outboundId: string;
  bearerToken: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
