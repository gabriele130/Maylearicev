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
  name: z.string().min(1, "Nome/Ragione Sociale è richiesto"),
  profileName: z.string().min(1, "Nome del profilo è richiesto"),
  address: z.string().min(1, "Indirizzo è richiesto"),
  city: z.string().min(1, "Città è richiesta"),
  postcode: z.string().min(1, "CAP è richiesto"),
  phone: z.string().min(1, "Telefono è richiesto"),
  vat: z.string().optional().nullable(),
  email: z.string().email("Email non valida").optional().nullable(),
  createdAt: z.date().optional(),
});

export const transportFormSchema = z.object({
  sender: senderProfileSchema,
  recipient: z.object({
    name: z.string().min(1, "Nome/Ragione Sociale è richiesto"),
    address: z.string().min(1, "Indirizzo è richiesto"),
    city: z.string().min(1, "Città è richiesta"),
    postcode: z.string().min(1, "CAP è richiesto"),
    phone: z.string().min(1, "Telefono è richiesto"),
    vat: z.string().optional(),
    email: z.string().email("Email non valida").optional(),
  }),
  package: z.object({
    count: z.coerce.number().min(1, "Numero Colli deve essere almeno 1"),
    weight: z.coerce.number().min(0.1, "Peso deve essere maggiore di 0"),
    dimensions: z.string().optional(),
    content: z.string().min(1, "Descrizione contenuto è richiesta"),
    shippingCost: z.coerce.number().min(0, "Il costo di spedizione non può essere negativo").optional(),
    paymentMethod: z.enum(["Contanti", "Carta", "Bonifico", "Contrassegno"]).default("Contanti"),
  }),
  insurance: z.object({
    value: z.coerce.number().min(0, "Il valore assicurato non può essere negativo").optional(),
    notes: z.string().optional(),
  }),
  saveSender: z.boolean().optional(),
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
