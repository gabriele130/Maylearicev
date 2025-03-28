import { pgTable, text, serial, integer, boolean, jsonb, timestamp, doublePrecision, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const senderProfiles = pgTable("sender_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profileName: text("profile_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  phone: text("phone").notNull(),
  vat: text("vat"),
  email: text("email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const recipientProfiles = pgTable("recipient_profiles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profileName: text("profile_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  phone: text("phone").notNull(),
  vat: text("vat"),
  email: text("email"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transportDocuments = pgTable("transport_documents", {
  id: serial("id").primaryKey(),
  documentNumber: text("document_number").notNull().unique(),
  senderName: text("sender_name").notNull(),
  senderAddress: text("sender_address").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  packageContent: text("package_content").notNull(),
  packageWeight: text("package_weight").notNull(),
  packageCount: integer("package_count").notNull(),
  packageDimensions: text("package_dimensions"),
  insuranceValue: text("insurance_value"),
  shippingCost: text("shipping_cost"),
  notes: text("notes"),
  paymentMethod: text("payment_method"),
  formData: jsonb("form_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  shareToken: text("share_token"),
});

export const weightStats = pgTable("weight_stats", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => transportDocuments.id),
  totalWeight: doublePrecision("total_weight").notNull(),  // peso totale (peso * numero colli)
  packageCount: integer("package_count").notNull(),
  transportDate: timestamp("transport_date").notNull().defaultNow(),
  transportDay: date("transport_day").notNull(),  // Data senza ora per aggregazione
  destination: text("destination"),  // Città destinazione
  transportType: text("transport_type"),  // Tipo di trasporto
  vehicleType: text("vehicle_type"),  // Mezzo utilizzato
  // Rimuoviamo il riferimento a operatorId per ora
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSenderProfileSchema = createInsertSchema(senderProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertRecipientProfileSchema = createInsertSchema(recipientProfiles).omit({
  id: true,
  createdAt: true,
});

export const profileSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nome/Ragione Sociale è richiesto"),
  profileName: z.string().min(1, "Nome del profilo è richiesto"),
  address: z.string().min(1, "Indirizzo è richiesto"),
  city: z.string().min(1, "Città è richiesta"),
  postcode: z.string().min(1, "CAP è richiesto"),
  phone: z.string().min(1, "Telefono è richiesto"),
  vat: z.string().optional().nullable(),
  email: z.union([
    z.string().email("Email non valida"),
    z.string().length(0),  // Accetta stringa vuota 
    z.null(),  // Accetta null esplicitamente
  ]).optional().nullable(),
  createdAt: z.union([
    z.date(),
    z.string().transform(val => new Date(val))
  ]).optional(),
});

export const senderProfileSchema = profileSchema;
export const recipientProfileSchema = profileSchema;

export const transportFormSchema = z.object({
  sender: senderProfileSchema,
  recipient: recipientProfileSchema,
  package: z.object({
    count: z.coerce.number().min(1, "Numero Colli deve essere almeno 1"),
    weight: z.coerce.number().min(0.1, "Peso deve essere maggiore di 0"),
    dimensions: z.string().optional().nullable(),
    content: z.string().min(1, "Descrizione contenuto è richiesta"),
    shippingCost: z.union([
      z.coerce.number().min(0, "Il costo di spedizione non può essere negativo"),
      z.string().transform(val => {
        // Rimuovi caratteri non numerici e converti a numero
        const numVal = Number(val.replace(/[^\d.-]/g, ''));
        return isNaN(numVal) ? 0 : numVal;
      })
    ]).optional().nullable(),
    paymentMethod: z.enum(["Contanti", "Carta", "Bonifico", "Contrassegno"]).default("Contanti").optional().nullable(),
  }),
  insurance: z.object({
    value: z.coerce.number().min(0, "Il valore assicurato non può essere negativo").optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
  saveSender: z.boolean().optional().default(false),
  saveRecipient: z.boolean().optional().default(false),
  profileName: z.string().optional().nullable(),
  recipientProfileName: z.string().optional().nullable(),
});

export const insertTransportDocumentSchema = createInsertSchema(transportDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertWeightStatSchema = createInsertSchema(weightStats, {
  transportDay: z.string(),  // Ensure transportDay is handled as string
}).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSenderProfile = z.infer<typeof insertSenderProfileSchema>;
export type SenderProfile = typeof senderProfiles.$inferSelect;
export type InsertRecipientProfile = z.infer<typeof insertRecipientProfileSchema>;
export type RecipientProfile = typeof recipientProfiles.$inferSelect;
export type TransportFormData = z.infer<typeof transportFormSchema>;
export type InsertTransportDocument = z.infer<typeof insertTransportDocumentSchema>;
export type TransportDocument = typeof transportDocuments.$inferSelect;
export type InsertWeightStat = z.infer<typeof insertWeightStatSchema>;
export type WeightStat = typeof weightStats.$inferSelect;

// Additional helper type for recipient in forms
export type RecipientFormData = {
  name: string;
  address: string;
  city: string;
  postcode: string;
  phone: string;
  vat?: string | null;
  email?: string | null;
  profileName?: string;
};
