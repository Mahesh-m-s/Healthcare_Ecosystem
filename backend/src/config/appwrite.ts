import * as sdk from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

export const {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY,
  APPWRITE_DATABASE_ID,
  APPWRITE_PATIENT_COLLECTION_ID,
  APPWRITE_APPOINTMENT_COLLECTION_ID,
  APPWRITE_BUCKET_ID,
} = process.env;

const client = new sdk.Client();

client
  .setEndpoint(APPWRITE_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!);

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);
