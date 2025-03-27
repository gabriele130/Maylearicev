import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { senderProfileSchema, insertSenderProfileSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all sender profiles
  app.get("/api/sender-profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllSenderProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sender profiles" });
    }
  });

  // Get sender profile by ID
  app.get("/api/sender-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      const profile = await storage.getSenderProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "Sender profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sender profile" });
    }
  });

  // Create a new sender profile
  app.post("/api/sender-profiles", async (req, res) => {
    try {
      // First use the user-facing schema to validate basic format
      const userProfileData = senderProfileSchema.parse(req.body);
      
      // Then prepare data for database insert - using insertSenderProfileSchema ensures correct types
      const dbProfileData = {
        name: userProfileData.name,
        profileName: userProfileData.profileName,
        vat: userProfileData.vat || null, 
        address: userProfileData.address,
        city: userProfileData.city,
        postcode: userProfileData.postcode,
        phone: userProfileData.phone,
        email: userProfileData.email || null,
        createdAt: new Date().toISOString()
      };
      
      // Save to storage
      const savedProfile = await storage.createSenderProfile(dbProfileData);
      
      res.status(201).json(savedProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating sender profile:", error);
      res.status(500).json({ message: "Failed to create sender profile" });
    }
  });

  // Delete a sender profile
  app.delete("/api/sender-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      const success = await storage.deleteSenderProfile(id);
      if (!success) {
        return res.status(404).json({ message: "Sender profile not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete sender profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
