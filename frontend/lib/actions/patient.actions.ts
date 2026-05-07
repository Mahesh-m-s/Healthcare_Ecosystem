"use server";

import axios from "axios";
import { parseStringify } from "../utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// CREATE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return parseStringify(response.data);
  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error.response?.data || error.message);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return parseStringify(response.data);
  } catch (error: any) {
    console.error(
      "An error occurred while retrieving the user details:",
      error.response?.data || error.message
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    const formData = new FormData();
    
    if (identificationDocument) {
      formData.append(
        "identificationDocument",
        identificationDocument.get("blobFile") as Blob,
        identificationDocument.get("fileName") as string
      );
    }
    
    formData.append("patientData", JSON.stringify(patient));

    const response = await axios.post(`${API_URL}/patients`, formData);

    return parseStringify(response.data);
  } catch (error: any) {
    console.error("An error occurred while creating a new patient:", error.response?.data || error.message);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/patients/${userId}`);
    return parseStringify(response.data);
  } catch (error: any) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error.response?.data || error.message
    );
  }
};
