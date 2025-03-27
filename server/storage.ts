import { users, type User, type InsertUser, type SenderProfile } from "@shared/schema";

// Modify the interface with any CRUD methods you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sender profile methods
  getAllSenderProfiles(): Promise<SenderProfile[]>;
  getSenderProfile(id: number): Promise<SenderProfile | undefined>;
  createSenderProfile(profile: Omit<SenderProfile, "id">): Promise<SenderProfile>;
  deleteSenderProfile(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private senderProfiles: Map<number, SenderProfile>;
  private currentUserId: number;
  private currentProfileId: number;

  constructor() {
    this.users = new Map();
    this.senderProfiles = new Map();
    this.currentUserId = 1;
    this.currentProfileId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllSenderProfiles(): Promise<SenderProfile[]> {
    return Array.from(this.senderProfiles.values()).sort((a, b) => {
      // Sort by creation date descending (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getSenderProfile(id: number): Promise<SenderProfile | undefined> {
    return this.senderProfiles.get(id);
  }

  async createSenderProfile(profile: Omit<SenderProfile, "id">): Promise<SenderProfile> {
    const id = this.currentProfileId++;
    const newProfile: SenderProfile = { ...profile, id };
    this.senderProfiles.set(id, newProfile);
    return newProfile;
  }

  async deleteSenderProfile(id: number): Promise<boolean> {
    if (!this.senderProfiles.has(id)) {
      return false;
    }
    return this.senderProfiles.delete(id);
  }
}

export const storage = new MemStorage();
