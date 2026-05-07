import { Router, Request, Response } from "express";
import { ID, Query } from "node-appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_PATIENT_COLLECTION_ID,
  APPWRITE_BUCKET_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  databases,
  storage,
  users,
} from "../config/appwrite";

const router = Router();

// CREATE USER
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, phone } = req.body;

    const newUser = await users.create(
      ID.unique(),
      email,
      phone,
      undefined,
      name
    );

    res.status(201).json(newUser);
  } catch (error: any) {
    if (error?.code === 409) {
      try {
        const existingUser = await users.list([
          Query.equal("email", [req.body.email]),
        ]);
        res.status(200).json(existingUser.users[0]);
      } catch (listError) {
        console.error("Error listing existing users:", listError);
        res.status(500).json({ error: "Failed to find existing user" });
      }
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

// GET USER
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const user = await users.get(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

export default router;
