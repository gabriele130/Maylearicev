import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
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
  vat: text("vat"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postcode: text("postcode").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  createdAt: text("created_at").notNull(),
});

export const transportDocuments = pgTable("transport_documents", {
  id: serial("id").primaryKey(),
  documentId: text("document_id").notNull().unique(),
  formData: jsonb("form_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  shareToken: text("share_token").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSenderProfileSchema = createInsertSchema(senderProfiles).omit({
  id: true,
  createdAt: true,
});

export const senderProfileSchema = z.object({
  id: z.number().optional(),
  profileName: z.string().min(1, "Nome profilo è richiesto"),
  name: z.string().min(1, "Nome/Ragione Sociale è richiesto"),
  vat: z.string().optional(),
  address: z.string().min(1, "Indirizzo è richiesto"),
  city: z.string().min(1, "Città è richiesta"),
  postcode: z.string().min(1, "CAP è richiesto"),
  phone: z.string().min(1, "Telefono è richiesto"),
  email: z.string().email("Email non valida").optional().or(z.string().length(0)),
  createdAt: z.string().optional(),
});

export const transportFormSchema = z.object({
  sender: senderProfileSchema,
  recipient: z.object({
    name: z.string().min(1, "Nome/Ragione Sociale è richiesto"),
    vat: z.string().optional(),
    address: z.string().min(1, "Indirizzo è richiesto"),
    city: z.string().min(1, "Città è richiesta"),
    postcode: z.string().min(1, "CAP è richiesto"),
    phone: z.string().min(1, "Telefono è richiesto"),
    email: z.string().email("Email non valida").optional().or(z.string().length(0)),
  }),
  package: z.object({
    count: z.coerce.number().min(1, "Numero Colli deve essere almeno 1"),
    weight: z.coerce.number().min(0.1, "Peso deve essere maggiore di 0"),
    dimensions: z.string().optional(),
    content: z.string().min(1, "Descrizione contenuto è richiesta"),
    shippingCost: z.coerce.number().min(0, "Il costo di spedizione non può essere negativo").optional(),
  }),
  insurance: z.object({
    value: z.coerce.number().min(0, "Il valore assicurato non può essere negativo").optional(),
    notes: z.string().optional(),
  }),
  saveSender: z.boolean().optional(),
  profileName: z.string().optional(),
});

export const insertTransportDocumentSchema = createInsertSchema(transportDocuments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSenderProfile = z.infer<typeof insertSenderProfileSchema>;
export type SenderProfile = typeof senderProfiles.$inferSelect;
export type TransportFormData = z.infer<typeof transportFormSchema>;
export type InsertTransportDocument = z.infer<typeof insertTransportDocumentSchema>;
export type TransportDocument = typeof transportDocuments.$inferSelect;
