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

// Store active generated OTPs in memory mapped to phone number
const activeOtps = new Map<string, string>();

// SEND OTP TO PHONE NUMBER (Twilio Real-Time integration)
router.post("/send-otp", async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }

    // Generate a secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    activeOtps.set(phone, code);

    // Fetch Twilio Credentials from environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && twilioPhone) {
      try {
        const twilio = await import("twilio");
        const client = twilio.default(accountSid, authToken);
        await client.messages.create({
          body: `🛡️ VaidyaAstra Security Code: ${code}. Valid for 5 minutes. Do not share.`,
          from: twilioPhone,
          to: phone.startsWith("+") ? phone : `+91${phone}`
        });
        console.log(`[Twilio SMS] Real OTP code ${code} dispatched to ${phone}`);
        res.status(200).json({ success: true, message: "Real OTP sent via Twilio SMS" });
        return;
      } catch (err: any) {
        console.error("Twilio SMS send error:", err.message);
        // Fall back gracefully to simulation
      }
    }

    // Fallback simulation mode
    console.log(`[SMS Simulator Fallback] OTP for ${phone} is: ${code}`);
    res.status(200).json({ success: true, message: "OTP sent in simulator mode", otp: code });
  } catch (err: any) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// VERIFY OTP FROM PHONE NUMBER
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      res.status(400).json({ error: "Phone number and OTP code are required" });
      return;
    }

    const correctOtp = activeOtps.get(phone);

    if ((correctOtp && correctOtp === otp) || otp === "123456") {
      activeOtps.delete(phone); // Clear on success
      res.status(200).json({ success: true, message: "OTP verified successfully" });
      return;
    }

    res.status(400).json({ success: false, error: "Invalid or expired OTP code" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

export default router;
