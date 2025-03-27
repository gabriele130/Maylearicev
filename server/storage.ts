import { users, senderProfiles, transportDocuments, type User, type InsertUser, type SenderProfile, type TransportDocument, type InsertTransportDocument, type TransportFormData } from "@shared/schema";
import { db } from "./db";
import { eq, desc, lt, gte } from "drizzle-orm";
import { randomUUID } from "crypto";
import { add } from "date-fns";

// Interface is kept the same for compatibility
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sender profile methods
  getAllSenderProfiles(): Promise<SenderProfile[]>;
  getSenderProfile(id: number): Promise<SenderProfile | undefined>;
  createSenderProfile(profile: Omit<SenderProfile, "id">): Promise<SenderProfile>;
  updateSenderProfile(id: number, profile: Omit<SenderProfile, "id" | "createdAt">): Promise<SenderProfile | undefined>;
  deleteSenderProfile(id: number): Promise<boolean>;
  
  // Transport document methods
  getAllTransportDocuments(): Promise<TransportDocument[]>;
  getTransportDocument(id: number): Promise<TransportDocument | undefined>;
  createTransportDocument(formData: TransportFormData): Promise<TransportDocument>;
  deleteTransportDocument(id: number): Promise<boolean>;
  deleteExpiredDocuments(): Promise<number>;
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

  async updateSenderProfile(id: number, profile: Omit<SenderProfile, "id" | "createdAt">): Promise<SenderProfile | undefined> {
    try {
      // Handle nullable fields properly
      const dbProfile = {
        ...profile,
        vat: profile.vat || null,
        email: profile.email || null
      };
      
      const [updatedProfile] = await db
        .update(senderProfiles)
        .set(dbProfile)
        .where(eq(senderProfiles.id, id))
        .returning();
      
      return updatedProfile;
    } catch (error) {
      console.error("Error updating sender profile:", error);
      throw error;
    }
  }

  async deleteSenderProfile(id: number): Promise<boolean> {
    const result = await db
      .delete(senderProfiles)
      .where(eq(senderProfiles.id, id))
      .returning({ id: senderProfiles.id });
    
    return result.length > 0;
  }
  
  async getAllTransportDocuments(): Promise<TransportDocument[]> {
    try {
      // Fetch only non-expired documents, sorted by creation date (newest first)
      const documents = await db
        .select()
        .from(transportDocuments)
        .where(gte(transportDocuments.expiresAt, new Date()))
        .orderBy(desc(transportDocuments.createdAt));
      
      return documents;
    } catch (error) {
      console.error("Error fetching transport documents:", error);
      throw error;
    }
  }
  
  async getTransportDocument(id: number): Promise<TransportDocument | undefined> {
    const [document] = await db
      .select()
      .from(transportDocuments)
      .where(eq(transportDocuments.id, id));
    
    return document || undefined;
  }
  
  async createTransportDocument(formData: TransportFormData): Promise<TransportDocument> {
    try {
      // Generate document number (4-digit)
      const documentNumber = `MLD-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Calculate expiry date (4 months from now)
      const expiresAt = add(new Date(), { months: 4 });
      
      // Create a new document
      const newDocument = {
        documentNumber,
        senderName: formData.sender.name,
        senderAddress: formData.sender.address,
        recipientName: formData.recipient.name,
        recipientAddress: formData.recipient.address,
        packageContent: formData.package.content,
        packageWeight: formData.package.weight.toString(),
        packageCount: formData.package.count,
        packageDimensions: formData.package.dimensions || null,
        insuranceValue: formData.insurance.value?.toString() || null,
        shippingCost: formData.package.shippingCost?.toString() || null,
        notes: formData.insurance.notes || null,
        paymentMethod: formData.package.paymentMethod || "Contanti",
        formData: formData as any, // Store the complete form data as JSON
        expiresAt,
        shareToken: randomUUID(),
      };
      
      const [savedDocument] = await db
        .insert(transportDocuments)
        .values(newDocument)
        .returning();
      
      return savedDocument;
    } catch (error) {
      console.error("Error creating transport document:", error);
      throw error;
    }
  }
  
  async deleteTransportDocument(id: number): Promise<boolean> {
    const result = await db
      .delete(transportDocuments)
      .where(eq(transportDocuments.id, id))
      .returning({ id: transportDocuments.id });
    
    return result.length > 0;
  }
  
  async deleteExpiredDocuments(): Promise<number> {
    try {
      // Delete documents older than 4 months
      const now = new Date();
      const result = await db
        .delete(transportDocuments)
        .where(lt(transportDocuments.expiresAt, now))
        .returning({ id: transportDocuments.id });
      
      return result.length;
    } catch (error) {
      console.error("Error deleting expired documents:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
