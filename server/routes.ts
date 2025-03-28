import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { senderProfileSchema, recipientProfileSchema, transportFormSchema, insertSenderProfileSchema, insertRecipientProfileSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { addDays, startOfDay, endOfDay, subDays, subMonths, format } from "date-fns";

// Schedule automatic deletion of expired documents
function scheduleDocumentCleanup() {
  const INTERVAL_HOURS = 24; // Run once per day
  
  const runCleanup = async () => {
    try {
      const deletedCount = await storage.deleteExpiredDocuments();
      console.log(`Deleted ${deletedCount} expired transport documents`);
    } catch (error) {
      console.error("Error during document cleanup:", error);
    }
  };
  
  // Run cleanup immediately on startup
  runCleanup();
  
  // Schedule periodic cleanup
  setInterval(runCleanup, INTERVAL_HOURS * 60 * 60 * 1000);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Start document cleanup scheduler
  scheduleDocumentCleanup();

  // ----- SENDER PROFILES API -----
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
      console.log("Received profile data:", JSON.stringify(req.body));
      
      // First use the user-facing schema to validate basic format
      const userProfileData = senderProfileSchema.parse({
        ...req.body,
        // Assicuriamoci che i campi opzionali siano gestiti correttamente
        vat: req.body.vat === undefined ? null : req.body.vat,
        email: req.body.email === undefined ? null : req.body.email
      });
      
      // Then prepare data for database insert - using insertSenderProfileSchema ensures correct types
      // Creiamo il profilo con i tipi corretti
      const dbProfileData = {
        name: userProfileData.name,
        profileName: userProfileData.profileName,
        vat: userProfileData.vat as string | null, 
        address: userProfileData.address,
        city: userProfileData.city,
        postcode: userProfileData.postcode,
        phone: userProfileData.phone,
        email: userProfileData.email as string | null,
        createdAt: new Date()
      };
      
      // Save to storage
      const savedProfile = await storage.createSenderProfile(dbProfileData);
      
      res.status(201).json(savedProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating sender profile:", error);
      res.status(500).json({ message: "Failed to create sender profile" });
    }
  });

  // Update a sender profile
  app.put("/api/sender-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      console.log("Updating profile with ID:", id);
      console.log("Received update data:", JSON.stringify(req.body));
      
      // Validate the input data
      const userProfileData = senderProfileSchema.parse({
        ...req.body,
        vat: req.body.vat === undefined ? null : req.body.vat,
        email: req.body.email === undefined ? null : req.body.email
      });
      
      // Prepare data for database update
      const dbProfileData = {
        name: userProfileData.name,
        profileName: userProfileData.profileName,
        address: userProfileData.address,
        city: userProfileData.city,
        postcode: userProfileData.postcode,
        phone: userProfileData.phone,
        vat: userProfileData.vat === undefined ? null : userProfileData.vat, 
        email: userProfileData.email === undefined ? null : userProfileData.email
      };
      
      // Update in storage
      const updatedProfile = await storage.updateSenderProfile(id, dbProfileData);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Sender profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating sender profile:", error);
      res.status(500).json({ message: "Failed to update sender profile" });
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

  // ----- RECIPIENT PROFILES API -----
  // Get all recipient profiles
  app.get("/api/recipient-profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllRecipientProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipient profiles" });
    }
  });

  // Get recipient profile by ID
  app.get("/api/recipient-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      const profile = await storage.getRecipientProfile(id);
      if (!profile) {
        return res.status(404).json({ message: "Recipient profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipient profile" });
    }
  });

  // Create a new recipient profile
  app.post("/api/recipient-profiles", async (req, res) => {
    try {
      console.log("Received recipient profile data:", JSON.stringify(req.body));
      
      // First use the user-facing schema to validate basic format
      const userProfileData = recipientProfileSchema.parse({
        ...req.body,
        // Assicuriamoci che i campi opzionali siano gestiti correttamente
        vat: req.body.vat === undefined ? null : req.body.vat,
        email: req.body.email === undefined ? null : req.body.email
      });
      
      // Then prepare data for database insert
      const dbProfileData = {
        name: userProfileData.name,
        profileName: userProfileData.profileName,
        vat: userProfileData.vat as string | null, 
        address: userProfileData.address,
        city: userProfileData.city,
        postcode: userProfileData.postcode,
        phone: userProfileData.phone,
        email: userProfileData.email as string | null,
        createdAt: new Date()
      };
      
      // Save to storage
      const savedProfile = await storage.createRecipientProfile(dbProfileData);
      
      res.status(201).json(savedProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating recipient profile:", error);
      res.status(500).json({ message: "Failed to create recipient profile" });
    }
  });

  // Update a recipient profile
  app.put("/api/recipient-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      console.log("Updating recipient profile with ID:", id);
      console.log("Received update data:", JSON.stringify(req.body));
      
      // Validate the input data
      const userProfileData = recipientProfileSchema.parse({
        ...req.body,
        vat: req.body.vat === undefined ? null : req.body.vat,
        email: req.body.email === undefined ? null : req.body.email
      });
      
      // Prepare data for database update
      const dbProfileData = {
        name: userProfileData.name,
        profileName: userProfileData.profileName,
        address: userProfileData.address,
        city: userProfileData.city,
        postcode: userProfileData.postcode,
        phone: userProfileData.phone,
        vat: userProfileData.vat === undefined ? null : userProfileData.vat, 
        email: userProfileData.email === undefined ? null : userProfileData.email
      };
      
      // Update in storage
      const updatedProfile = await storage.updateRecipientProfile(id, dbProfileData);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Recipient profile not found" });
      }
      
      res.json(updatedProfile);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error:", validationError.message);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating recipient profile:", error);
      res.status(500).json({ message: "Failed to update recipient profile" });
    }
  });

  // Delete a recipient profile
  app.delete("/api/recipient-profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }
      
      const success = await storage.deleteRecipientProfile(id);
      if (!success) {
        return res.status(404).json({ message: "Recipient profile not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete recipient profile" });
    }
  });

  // ----- TRANSPORT DOCUMENTS API -----
  // Get all transport documents
  app.get("/api/transport-documents", async (req, res) => {
    try {
      const documents = await storage.getAllTransportDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching transport documents:", error);
      res.status(500).json({ message: "Failed to fetch transport documents" });
    }
  });

  // Get transport document by ID
  app.get("/api/transport-documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const document = await storage.getTransportDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Transport document not found" });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error fetching transport document:", error);
      res.status(500).json({ message: "Failed to fetch transport document" });
    }
  });

  // Create a new transport document
  app.post("/api/transport-documents", async (req, res) => {
    try {
      console.log("Received document data:", JSON.stringify(req.body));
      
      // Validate form data
      const formData = transportFormSchema.parse(req.body);
      
      console.log("Document data after validation:", JSON.stringify(formData));
      
      // Save the document
      const savedDocument = await storage.createTransportDocument(formData);
      
      // If the user wants to save the sender profile, do it
      if (formData.saveSender && formData.sender) {
        try {
          // Check if we have a provided profile name
          const profileName = formData.profileName || `${formData.sender.name} (${formData.sender.address})`;
          
          // Check if profile already exists by matching name and address
          const existingProfiles = await storage.getAllSenderProfiles();
          const exists = existingProfiles.some(
            p => p.name === formData.sender.name && p.address === formData.sender.address
          );
          
          if (!exists) {
            await storage.createSenderProfile({
              name: formData.sender.name,
              profileName: profileName,
              address: formData.sender.address,
              city: formData.sender.city,
              postcode: formData.sender.postcode,
              phone: formData.sender.phone,
              vat: formData.sender.vat === undefined ? null : formData.sender.vat,
              email: formData.sender.email === undefined ? null : formData.sender.email,
              createdAt: new Date()
            });
          }
        } catch (profileError) {
          console.error("Error saving sender profile from document:", profileError);
          // Continue even if profile saving fails
        }
      }
      
      // If the user wants to save the recipient profile, do it
      if (formData.saveRecipient && formData.recipient) {
        try {
          // Check if we have a provided profile name for recipient
          const profileName = formData.recipientProfileName || `${formData.recipient.name} (${formData.recipient.address})`;
          
          // Check if profile already exists by matching name and address
          const existingProfiles = await storage.getAllRecipientProfiles();
          const exists = existingProfiles.some(
            p => p.name === formData.recipient.name && p.address === formData.recipient.address
          );
          
          if (!exists) {
            await storage.createRecipientProfile({
              name: formData.recipient.name,
              profileName: profileName,
              address: formData.recipient.address,
              city: formData.recipient.city,
              postcode: formData.recipient.postcode,
              phone: formData.recipient.phone,
              vat: formData.recipient.vat === undefined ? null : formData.recipient.vat,
              email: formData.recipient.email === undefined ? null : formData.recipient.email,
              createdAt: new Date()
            });
          }
        } catch (profileError) {
          console.error("Error saving recipient profile from document:", profileError);
          // Continue even if profile saving fails
        }
      }
      
      res.status(201).json(savedDocument);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating transport document:", error);
      res.status(500).json({ message: "Failed to create transport document" });
    }
  });

  // Delete a transport document
  app.delete("/api/transport-documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const success = await storage.deleteTransportDocument(id);
      if (!success) {
        return res.status(404).json({ message: "Transport document not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting transport document:", error);
      res.status(500).json({ message: "Failed to delete transport document" });
    }
  });

  // ----- WEIGHT STATISTICS API -----
  // Get all weight statistics
  app.get("/api/weight-stats", async (req, res) => {
    try {
      const stats = await storage.getWeightStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching weight stats:", error);
      res.status(500).json({ message: "Failed to fetch weight statistics" });
    }
  });

  // Get daily weight statistics
  app.get("/api/weight-stats/daily", async (req, res) => {
    try {
      // Parse date from query parameter or use today
      const dateParam = req.query.date as string;
      const date = dateParam ? new Date(dateParam) : new Date();
      
      const stats = await storage.getDailyWeightStats(date);
      res.json({
        date: format(date, 'yyyy-MM-dd'),
        ...stats
      });
    } catch (error) {
      console.error("Error fetching daily weight stats:", error);
      res.status(500).json({ message: "Failed to fetch daily weight statistics" });
    }
  });

  // Get weekly weight statistics
  app.get("/api/weight-stats/weekly", async (req, res) => {
    try {
      // Parse date from query parameter or use current week
      const dateParam = req.query.date as string;
      const date = dateParam ? new Date(dateParam) : new Date();
      
      const stats = await storage.getWeeklyWeightStats(date);
      res.json({
        weekStart: format(startOfDay(date), 'yyyy-MM-dd'),
        ...stats
      });
    } catch (error) {
      console.error("Error fetching weekly weight stats:", error);
      res.status(500).json({ message: "Failed to fetch weekly weight statistics" });
    }
  });

  // Get monthly weight statistics
  app.get("/api/weight-stats/monthly", async (req, res) => {
    try {
      // Parse date from query parameter or use current month
      const dateParam = req.query.date as string;
      const date = dateParam ? new Date(dateParam) : new Date();
      
      const stats = await storage.getMonthlyWeightStats(date);
      res.json({
        month: format(date, 'yyyy-MM'),
        ...stats
      });
    } catch (error) {
      console.error("Error fetching monthly weight stats:", error);
      res.status(500).json({ message: "Failed to fetch monthly weight statistics" });
    }
  });

  // Get weight statistics for custom period
  app.get("/api/weight-stats/period", async (req, res) => {
    try {
      // Parse start and end dates from query parameters
      const startDateParam = req.query.startDate as string;
      const endDateParam = req.query.endDate as string;
      
      if (!startDateParam || !endDateParam) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const startDate = new Date(startDateParam);
      const endDate = new Date(endDateParam);
      
      const stats = await storage.getWeightStatsByPeriod(startDate, endDate);
      res.json({
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        ...stats
      });
    } catch (error) {
      console.error("Error fetching period weight stats:", error);
      res.status(500).json({ message: "Failed to fetch period weight statistics" });
    }
  });

  // Get weight trends for last X days
  app.get("/api/weight-stats/trends", async (req, res) => {
    try {
      // Parse days parameter or default to 30
      const daysParam = req.query.days as string;
      const days = daysParam ? parseInt(daysParam) : 30;
      
      if (isNaN(days) || days <= 0 || days > 365) {
        return res.status(400).json({ message: "Days must be a number between 1 and 365" });
      }
      
      const trends = await storage.getWeightTrends(days);
      res.json(trends);
    } catch (error) {
      console.error("Error fetching weight trends:", error);
      res.status(500).json({ message: "Failed to fetch weight trends" });
    }
  });

  // Get destination statistics
  app.get("/api/weight-stats/destinations", async (req, res) => {
    try {
      // Parse period or default to last 30 days
      const periodParam = req.query.period as string || '30days';
      
      let startDate: Date, endDate: Date;
      
      switch (periodParam) {
        case '7days':
          startDate = subDays(startOfDay(new Date()), 7);
          endDate = new Date();
          break;
        case '30days':
          startDate = subDays(startOfDay(new Date()), 30);
          endDate = new Date();
          break;
        case '90days':
          startDate = subDays(startOfDay(new Date()), 90);
          endDate = new Date();
          break;
        case '1year':
          startDate = subMonths(startOfDay(new Date()), 12);
          endDate = new Date();
          break;
        default:
          return res.status(400).json({ message: "Invalid period. Use '7days', '30days', '90days', or '1year'" });
      }
      
      const stats = await storage.getDestinationStats(startDate, endDate);
      res.json({
        period: periodParam,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        destinations: stats
      });
    } catch (error) {
      console.error("Error fetching destination stats:", error);
      res.status(500).json({ message: "Failed to fetch destination statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
