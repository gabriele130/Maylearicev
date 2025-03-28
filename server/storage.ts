import { users, senderProfiles, recipientProfiles, transportDocuments, weightStats, revenueStats, type User, type InsertUser, type SenderProfile, type RecipientProfile, type TransportDocument, type InsertTransportDocument, type TransportFormData, type WeightStat, type InsertWeightStat, type RevenueStat, type InsertRevenueStat } from "@shared/schema";
import { db } from "./db";
import { eq, desc, lt, gte, and, count, sum, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { add, format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";

// Interface definition
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
  
  // Recipient profile methods
  getAllRecipientProfiles(): Promise<RecipientProfile[]>;
  getRecipientProfile(id: number): Promise<RecipientProfile | undefined>;
  createRecipientProfile(profile: Omit<RecipientProfile, "id">): Promise<RecipientProfile>;
  updateRecipientProfile(id: number, profile: Omit<RecipientProfile, "id" | "createdAt">): Promise<RecipientProfile | undefined>;
  deleteRecipientProfile(id: number): Promise<boolean>;
  
  // Transport document methods
  getAllTransportDocuments(): Promise<TransportDocument[]>;
  getTransportDocument(id: number): Promise<TransportDocument | undefined>;
  createTransportDocument(formData: TransportFormData): Promise<TransportDocument>;
  deleteTransportDocument(id: number): Promise<boolean>;
  deleteExpiredDocuments(): Promise<number>;
  
  // Weight statistics methods
  recordWeightStat(documentId: number, data: Omit<InsertWeightStat, "id" | "documentId">): Promise<WeightStat>;
  getWeightStats(): Promise<WeightStat[]>;
  getDailyWeightStats(date: Date): Promise<{totalWeight: number; totalPackages: number}>;
  getWeeklyWeightStats(date: Date): Promise<{totalWeight: number; totalPackages: number}>;
  getMonthlyWeightStats(date: Date): Promise<{totalWeight: number; totalPackages: number}>;
  getWeightStatsByPeriod(startDate: Date, endDate: Date): Promise<{totalWeight: number; totalPackages: number}>;
  getWeightTrends(days: number): Promise<Array<{date: string; totalWeight: number; totalPackages: number}>>;
  getDestinationStats(startDate: Date, endDate: Date): Promise<Array<{destination: string; totalWeight: number; count: number}>>;
  
  // Revenue statistics methods
  recordRevenueStat(documentId: number, data: Omit<InsertRevenueStat, "id" | "documentId">): Promise<RevenueStat>;
  getRevenueStats(): Promise<RevenueStat[]>;
  getDailyRevenueStats(date: Date): Promise<{totalAmount: number; count: number}>;
  getWeeklyRevenueStats(date: Date): Promise<{totalAmount: number; count: number}>;
  getMonthlyRevenueStats(date: Date): Promise<{totalAmount: number; count: number}>;
  getRevenueStatsByPeriod(startDate: Date, endDate: Date): Promise<{totalAmount: number; count: number}>;
  getRevenueTrends(days: number): Promise<Array<{date: string; totalAmount: number; count: number}>>;
  getRevenueByPaymentMethod(startDate: Date, endDate: Date): Promise<Array<{paymentMethod: string; totalAmount: number; count: number}>>;
  getDestinationRevenueStats(startDate: Date, endDate: Date): Promise<Array<{destination: string; totalAmount: number; count: number}>>;
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

  // Implementazione metodi per i profili destinatario
  async getAllRecipientProfiles(): Promise<RecipientProfile[]> {
    try {
      // Sort by creation date descending (newest first)
      console.log("Fetching all recipient profiles from database");
      const profiles = await db.select().from(recipientProfiles).orderBy(desc(recipientProfiles.createdAt));
      console.log("Fetched recipient profiles:", profiles);
      return profiles;
    } catch (error) {
      console.error("Error fetching recipient profiles:", error);
      throw error;
    }
  }

  async getRecipientProfile(id: number): Promise<RecipientProfile | undefined> {
    const [profile] = await db.select().from(recipientProfiles).where(eq(recipientProfiles.id, id));
    return profile || undefined;
  }

  async createRecipientProfile(profile: Omit<RecipientProfile, "id">): Promise<RecipientProfile> {
    // Handle nullable fields properly for database
    const dbProfile = {
      ...profile,
      vat: profile.vat || null,
      email: profile.email || null
    };
    
    const [savedProfile] = await db
      .insert(recipientProfiles)
      .values(dbProfile)
      .returning();
    
    return savedProfile;
  }

  async updateRecipientProfile(id: number, profile: Omit<RecipientProfile, "id" | "createdAt">): Promise<RecipientProfile | undefined> {
    try {
      // Handle nullable fields properly
      const dbProfile = {
        ...profile,
        vat: profile.vat || null,
        email: profile.email || null
      };
      
      const [updatedProfile] = await db
        .update(recipientProfiles)
        .set(dbProfile)
        .where(eq(recipientProfiles.id, id))
        .returning();
      
      return updatedProfile;
    } catch (error) {
      console.error("Error updating recipient profile:", error);
      throw error;
    }
  }

  async deleteRecipientProfile(id: number): Promise<boolean> {
    const result = await db
      .delete(recipientProfiles)
      .where(eq(recipientProfiles.id, id))
      .returning({ id: recipientProfiles.id });
    
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

      // Registra i dati di peso per le statistiche
      const now = new Date();
      const weightStatData = {
        totalWeight: formData.package.weight * formData.package.count, // Peso totale (peso * numero colli)
        packageCount: formData.package.count,
        transportDate: now,
        transportDay: format(now, 'yyyy-MM-dd'), // Convert to string in yyyy-MM-dd format
        destination: formData.recipient.city, // Usa la città del destinatario
        transportType: "Strada", // Valore predefinito
        vehicleType: "Furgone", // Valore predefinito
        // Rimuoviamo operatorId poiché non abbiamo ancora utenti nel sistema
      };
      
      // Salva le statistiche di peso
      await this.recordWeightStat(savedDocument.id, weightStatData);
      
      // Registra i dati di entrate per le statistiche
      if (formData.package.shippingCost && formData.package.shippingCost > 0) {
        const revenueStatData = {
          amount: formData.package.shippingCost,
          paymentMethod: formData.package.paymentMethod || "Contanti",
          transportDate: now,
          transportDay: format(now, 'yyyy-MM-dd'),
          destination: formData.recipient.city
        };
        
        // Salva le statistiche di entrate
        await this.recordRevenueStat(savedDocument.id, revenueStatData);
      }

      // Se l'utente vuole salvare il profilo mittente, lo facciamo
      if (formData.saveSender && formData.profileName) {
        // Crea un oggetto profilo dal mittente
        const senderProfile = {
          name: formData.sender.name,
          profileName: formData.profileName, // Usa il nome profilo specificato
          address: formData.sender.address,
          city: formData.sender.city,
          postcode: formData.sender.postcode,
          phone: formData.sender.phone,
          vat: formData.sender.vat || null,
          email: formData.sender.email || null,
          createdAt: new Date()
        };
        
        // Salva il profilo mittente
        await this.createSenderProfile(senderProfile);
      }

      // Se l'utente vuole salvare il profilo destinatario, lo facciamo
      if (formData.saveRecipient && formData.recipientProfileName) {
        // Crea un oggetto profilo dal destinatario
        const recipientProfile = {
          name: formData.recipient.name,
          profileName: formData.recipientProfileName, // Usa il nome profilo specificato
          address: formData.recipient.address,
          city: formData.recipient.city,
          postcode: formData.recipient.postcode,
          phone: formData.recipient.phone,
          vat: formData.recipient.vat || null,
          email: formData.recipient.email || null,
          createdAt: new Date()
        };
        
        // Salva il profilo destinatario
        await this.createRecipientProfile(recipientProfile);
      }
      
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

  // Implementazione metodi per il tracciamento dei pesi
  async recordWeightStat(documentId: number, data: Omit<InsertWeightStat, "id" | "documentId">): Promise<WeightStat> {
    try {
      // Se transportDay è una Date, Drizzle si occuperà di convertirla correttamente nel formato del database
      const weightStatData = {
        documentId,
        ...data
      };

      const [savedStat] = await db
        .insert(weightStats)
        .values(weightStatData)
        .returning();

      return savedStat;
    } catch (error) {
      console.error("Error recording weight stat:", error);
      throw error;
    }
  }

  async getWeightStats(): Promise<WeightStat[]> {
    try {
      return await db
        .select()
        .from(weightStats)
        .orderBy(desc(weightStats.transportDate));
    } catch (error) {
      console.error("Error getting weight stats:", error);
      throw error;
    }
  }

  async getDailyWeightStats(date: Date): Promise<{totalWeight: number; totalPackages: number}> {
    try {
      const day = startOfDay(date);
      const nextDay = endOfDay(date);

      const [result] = await db
        .select({
          totalWeight: sum(weightStats.totalWeight),
          totalPackages: sum(weightStats.packageCount),
        })
        .from(weightStats)
        .where(
          and(
            gte(weightStats.transportDate, day),
            lt(weightStats.transportDate, nextDay)
          )
        );

      return {
        totalWeight: Number(result.totalWeight) || 0,
        totalPackages: Number(result.totalPackages) || 0,
      };
    } catch (error) {
      console.error("Error getting daily weight stats:", error);
      throw error;
    }
  }

  async getWeeklyWeightStats(date: Date): Promise<{totalWeight: number; totalPackages: number}> {
    try {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Lunedì
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

      const [result] = await db
        .select({
          totalWeight: sum(weightStats.totalWeight),
          totalPackages: sum(weightStats.packageCount),
        })
        .from(weightStats)
        .where(
          and(
            gte(weightStats.transportDate, weekStart),
            lt(weightStats.transportDate, weekEnd)
          )
        );

      return {
        totalWeight: Number(result.totalWeight) || 0,
        totalPackages: Number(result.totalPackages) || 0,
      };
    } catch (error) {
      console.error("Error getting weekly weight stats:", error);
      throw error;
    }
  }

  async getMonthlyWeightStats(date: Date): Promise<{totalWeight: number; totalPackages: number}> {
    try {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const [result] = await db
        .select({
          totalWeight: sum(weightStats.totalWeight),
          totalPackages: sum(weightStats.packageCount),
        })
        .from(weightStats)
        .where(
          and(
            gte(weightStats.transportDate, monthStart),
            lt(weightStats.transportDate, monthEnd)
          )
        );

      return {
        totalWeight: Number(result.totalWeight) || 0,
        totalPackages: Number(result.totalPackages) || 0,
      };
    } catch (error) {
      console.error("Error getting monthly weight stats:", error);
      throw error;
    }
  }

  async getWeightStatsByPeriod(startDate: Date, endDate: Date): Promise<{totalWeight: number; totalPackages: number}> {
    try {
      const [result] = await db
        .select({
          totalWeight: sum(weightStats.totalWeight),
          totalPackages: sum(weightStats.packageCount),
        })
        .from(weightStats)
        .where(
          and(
            gte(weightStats.transportDate, startDate),
            lt(weightStats.transportDate, endDate)
          )
        );

      return {
        totalWeight: Number(result.totalWeight) || 0,
        totalPackages: Number(result.totalPackages) || 0,
      };
    } catch (error) {
      console.error("Error getting weight stats by period:", error);
      throw error;
    }
  }

  async getWeightTrends(days: number): Promise<Array<{date: string; totalWeight: number; totalPackages: number}>> {
    try {
      const startDate = startOfDay(subDays(new Date(), days));
      
      // Usiamo SQL grezzo per formattare la data come stringa
      const results = await db.execute(sql`
        SELECT 
          to_char(transport_date, 'YYYY-MM-DD') as date,
          SUM(total_weight) as total_weight,
          SUM(package_count) as total_packages
        FROM weight_stats
        WHERE transport_date >= ${startDate.toISOString()}
        GROUP BY to_char(transport_date, 'YYYY-MM-DD')
        ORDER BY date ASC
      `);

      return results.map(row => ({
        date: String(row.date),
        totalWeight: Number(row.total_weight) || 0,
        totalPackages: Number(row.total_packages) || 0,
      }));
    } catch (error) {
      console.error("Error getting weight trends:", error);
      throw error;
    }
  }

  async getDestinationStats(startDate: Date, endDate: Date): Promise<Array<{destination: string; totalWeight: number; count: number}>> {
    try {
      // Usiamo SQL grezzo per raggruppare per destinazione e sommare pesi e conteggi
      const results = await db.execute(sql`
        SELECT 
          COALESCE(destination, 'Altro') as destination,
          SUM(total_weight) as total_weight,
          COUNT(*) as count
        FROM weight_stats
        WHERE transport_date >= ${startDate.toISOString()} AND transport_date < ${endDate.toISOString()}
        GROUP BY destination
        ORDER BY SUM(total_weight) DESC
      `);

      return results.map(row => ({
        destination: String(row.destination),
        totalWeight: Number(row.total_weight) || 0,
        count: Number(row.count) || 0,
      }));
    } catch (error) {
      console.error("Error getting destination stats:", error);
      throw error;
    }
  }

  // Implementazione metodi per il tracciamento delle entrate
  async recordRevenueStat(documentId: number, data: Omit<InsertRevenueStat, "id" | "documentId">): Promise<RevenueStat> {
    try {
      const revenueStatData = {
        documentId,
        ...data
      };

      const [savedStat] = await db
        .insert(revenueStats)
        .values(revenueStatData)
        .returning();

      return savedStat;
    } catch (error) {
      console.error("Error recording revenue stat:", error);
      throw error;
    }
  }

  async getRevenueStats(): Promise<RevenueStat[]> {
    try {
      return await db
        .select()
        .from(revenueStats)
        .orderBy(desc(revenueStats.transportDate));
    } catch (error) {
      console.error("Error getting revenue stats:", error);
      throw error;
    }
  }

  async getDailyRevenueStats(date: Date): Promise<{totalAmount: number; count: number}> {
    try {
      const day = startOfDay(date);
      const nextDay = endOfDay(date);

      const [result] = await db
        .select({
          totalAmount: sum(revenueStats.amount),
          count: count(),
        })
        .from(revenueStats)
        .where(
          and(
            gte(revenueStats.transportDate, day),
            lt(revenueStats.transportDate, nextDay)
          )
        );

      return {
        totalAmount: Number(result.totalAmount) || 0,
        count: Number(result.count) || 0,
      };
    } catch (error) {
      console.error("Error getting daily revenue stats:", error);
      throw error;
    }
  }

  async getWeeklyRevenueStats(date: Date): Promise<{totalAmount: number; count: number}> {
    try {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Lunedì
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

      const [result] = await db
        .select({
          totalAmount: sum(revenueStats.amount),
          count: count(),
        })
        .from(revenueStats)
        .where(
          and(
            gte(revenueStats.transportDate, weekStart),
            lt(revenueStats.transportDate, weekEnd)
          )
        );

      return {
        totalAmount: Number(result.totalAmount) || 0,
        count: Number(result.count) || 0,
      };
    } catch (error) {
      console.error("Error getting weekly revenue stats:", error);
      throw error;
    }
  }

  async getMonthlyRevenueStats(date: Date): Promise<{totalAmount: number; count: number}> {
    try {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);

      const [result] = await db
        .select({
          totalAmount: sum(revenueStats.amount),
          count: count(),
        })
        .from(revenueStats)
        .where(
          and(
            gte(revenueStats.transportDate, monthStart),
            lt(revenueStats.transportDate, monthEnd)
          )
        );

      return {
        totalAmount: Number(result.totalAmount) || 0,
        count: Number(result.count) || 0,
      };
    } catch (error) {
      console.error("Error getting monthly revenue stats:", error);
      throw error;
    }
  }

  async getRevenueStatsByPeriod(startDate: Date, endDate: Date): Promise<{totalAmount: number; count: number}> {
    try {
      const [result] = await db
        .select({
          totalAmount: sum(revenueStats.amount),
          count: count(),
        })
        .from(revenueStats)
        .where(
          and(
            gte(revenueStats.transportDate, startDate),
            lt(revenueStats.transportDate, endDate)
          )
        );

      return {
        totalAmount: Number(result.totalAmount) || 0,
        count: Number(result.count) || 0,
      };
    } catch (error) {
      console.error("Error getting revenue stats by period:", error);
      throw error;
    }
  }

  async getRevenueTrends(days: number): Promise<Array<{date: string; totalAmount: number; count: number}>> {
    try {
      const endDate = new Date();
      const startDate = subDays(endDate, days);
      
      // Query SQL per trends giornalieri con GROUP BY
      const results = await db.execute(sql`
        SELECT 
          to_char(transport_date, 'YYYY-MM-DD') as date, 
          SUM(amount) as total_amount, 
          COUNT(*) as count
        FROM revenue_stats
        WHERE transport_date >= ${startDate.toISOString()}
        GROUP BY to_char(transport_date, 'YYYY-MM-DD')
        ORDER BY date ASC
      `);
      
      // Trasforma i risultati
      return results.map(row => ({
        date: String(row.date),
        totalAmount: Number(row.total_amount) || 0,
        count: Number(row.count) || 0
      }));
    } catch (error) {
      console.error("Error getting revenue trends:", error);
      throw error;
    }
  }

  async getRevenueByPaymentMethod(startDate: Date, endDate: Date): Promise<Array<{paymentMethod: string; totalAmount: number; count: number}>> {
    try {
      // Query SQL per raggruppare per metodo di pagamento
      const results = await db.execute(sql`
        SELECT 
          COALESCE(payment_method, 'Contanti') as payment_method, 
          SUM(amount) as total_amount, 
          COUNT(*) as count
        FROM revenue_stats
        WHERE transport_date >= ${startDate.toISOString()} AND transport_date < ${endDate.toISOString()}
        GROUP BY payment_method
        ORDER BY SUM(amount) DESC
      `);
      
      // Trasforma i risultati
      return results.map(row => ({
        paymentMethod: String(row.payment_method),
        totalAmount: Number(row.total_amount) || 0,
        count: Number(row.count) || 0
      }));
    } catch (error) {
      console.error("Error getting revenue by payment method:", error);
      throw error;
    }
  }

  async getDestinationRevenueStats(startDate: Date, endDate: Date): Promise<Array<{destination: string; totalAmount: number; count: number}>> {
    try {
      // Query SQL per raggruppare per destinazione
      const results = await db.execute(sql`
        SELECT 
          COALESCE(destination, 'Altro') as destination, 
          SUM(amount) as total_amount, 
          COUNT(*) as count
        FROM revenue_stats
        WHERE transport_date >= ${startDate.toISOString()} AND transport_date < ${endDate.toISOString()}
        GROUP BY destination
        ORDER BY SUM(amount) DESC
      `);
      
      // Trasforma i risultati
      return results.map(row => ({
        destination: String(row.destination),
        totalAmount: Number(row.total_amount) || 0,
        count: Number(row.count) || 0
      }));
    } catch (error) {
      console.error("Error getting destination revenue stats:", error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();
