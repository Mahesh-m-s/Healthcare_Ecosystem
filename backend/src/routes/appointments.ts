import { Router, Request, Response } from "express";
import { ID, Query } from "node-appwrite";
import {
  APPWRITE_DATABASE_ID,
  APPWRITE_APPOINTMENT_COLLECTION_ID,
  databases,
  messaging,
} from "../config/appwrite";

const router = Router();

// Helper: format date time
const formatDateTime = (
  dateString: Date | string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone,
  };

  const formattedDateTime = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  return { dateTime: formattedDateTime };
};

// CREATE APPOINTMENT
router.post("/", async (req: Request, res: Response) => {
  try {
    const appointment = req.body;

    const newAppointment = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// GET RECENT APPOINTMENTS
router.get("/recent", async (_req: Request, res: Response) => {
  try {
    const appointments = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_APPOINTMENT_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")]
    );

    const initialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = appointments.documents.reduce(
      (acc: typeof initialCounts, appointment: any) => {
        switch (appointment.status) {
          case "scheduled":
            acc.scheduledCount++;
            break;
          case "pending":
            acc.pendingCount++;
            break;
          case "cancelled":
            acc.cancelledCount++;
            break;
        }
        return acc;
      },
      initialCounts
    );

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    res.status(200).json(data);
  } catch (error) {
    console.error("Error getting recent appointments:", error);
    res.status(500).json({ error: "Failed to get recent appointments" });
  }
});

// GET SINGLE APPOINTMENT
router.get("/:appointmentId", async (req: Request, res: Response) => {
  try {
    const appointment = await databases.getDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_APPOINTMENT_COLLECTION_ID!,
      req.params.appointmentId
    );

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error getting appointment:", error);
    res.status(500).json({ error: "Failed to get appointment" });
  }
});

// UPDATE APPOINTMENT
router.put("/:appointmentId", async (req: Request, res: Response) => {
  try {
    const { userId, timeZone, appointment, type } = req.body;
    const { appointmentId } = req.params;

    const updatedAppointment = await databases.updateDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_APPOINTMENT_COLLECTION_ID!,
      appointmentId,
      appointment
    );

    if (!updatedAppointment) {
      res.status(400).json({ error: "Failed to update appointment" });
      return;
    }

    // Send SMS notification
    const smsMessage = `Greetings from CarePulse. ${
      type === "schedule"
        ? `Your appointment is confirmed for ${
            formatDateTime(appointment.schedule, timeZone).dateTime
          } with Dr. ${appointment.primaryPhysician}`
        : `We regret to inform that your appointment for ${
            formatDateTime(appointment.schedule, timeZone).dateTime
          } is cancelled. Reason: ${appointment.cancellationReason}`
    }.`;

    try {
      await messaging.createSms(ID.unique(), smsMessage, [], [userId]);
    } catch (smsError) {
      console.error("SMS notification failed (non-critical):", smsError);
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
});

export default router;
