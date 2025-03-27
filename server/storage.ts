import { users, senderProfiles, type User, type InsertUser, type SenderProfile } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface is kept the same for compatibility
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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllSenderProfiles(): Promise<SenderProfile[]> {
    try {
      // Sort by creation date descending (newest first)
      console.log("Fetching all sender profiles from database");
      const profiles = await db.select().from(senderProfiles).orderBy(desc(senderProfiles.createdAt));
      console.log("Fetched profiles:", profiles);
      return profiles;
    } catch (error) {
      console.error("Error fetching sender profiles:", error);
      throw error;
    }
  }

  async getSenderProfile(id: number): Promise<SenderProfile | undefined> {
    const [profile] = await db.select().from(senderProfiles).where(eq(senderProfiles.id, id));
    return profile || undefined;
  }

  async createSenderProfile(profile: Omit<SenderProfile, "id">): Promise<SenderProfile> {
    // Handle nullable fields properly for database
    const dbProfile = {
      ...profile,
      vat: profile.vat || null,
      email: profile.email || null
    };
    
    const [savedProfile] = await db
      .insert(senderProfiles)
      .values(dbProfile)
      .returning();
    
    return savedProfile;
  }

  async deleteSenderProfile(id: number): Promise<boolean> {
    const result = await db
      .delete(senderProfiles)
      .where(eq(senderProfiles.id, id))
      .returning({ id: senderProfiles.id });
    
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
