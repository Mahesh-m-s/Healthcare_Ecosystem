import { Router, Request, Response } from "express";
import { ID, InputFile, Query } from "node-appwrite";
import multer from "multer";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_PATIENT_COLLECTION_ID,
  APPWRITE_BUCKET_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  databases,
  storage,
} from "../config/appwrite";

const router = Router();

// Configure multer for file uploads (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// REGISTER PATIENT
router.post("/", upload.single("identificationDocument"), async (req: Request, res: Response) => {
  try {
    const patientData = JSON.parse(req.body.patientData || "{}");
    const file = req.file;

    let uploadedFile;
    if (file) {
      const inputFile = InputFile.fromBuffer(file.buffer, file.originalname);
      uploadedFile = await storage.createFile(
        APPWRITE_BUCKET_ID!,
        ID.unique(),
        inputFile
      );
    }

    const newPatient = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: uploadedFile?.$id || null,
        identificationDocumentUrl: uploadedFile?.$id
          ? `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${APPWRITE_PROJECT_ID}`
          : null,
        ...patientData,
      }
    );

    res.status(201).json(newPatient);
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ error: "Failed to register patient" });
  }
});

// GET PATIENT BY USER ID
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const patients = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [req.params.userId])]
    );

    if (patients.documents.length === 0) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    res.status(200).json(patients.documents[0]);
  } catch (error) {
    console.error("Error getting patient:", error);
    res.status(500).json({ error: "Failed to get patient" });
  }
});

export default router;
