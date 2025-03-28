import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { senderProfileSchema, recipientProfileSchema, transportFormSchema, insertSenderProfileSchema, insertRecipientProfileSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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

  const httpServer = createServer(app);
  return httpServer;
}
