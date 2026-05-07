"use server";

import { revalidatePath } from "next/cache";
import axios from "axios";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const response = await axios.post(`${API_URL}/appointments`, appointment);
    revalidatePath("/admin");
    return parseStringify(response.data);
  } catch (error: any) {
    console.error("An error occurred while creating a new appointment:", error.response?.data || error.message);
  }
};

//  GET RECENT APPOINTMENTS
export const getRecentAppointmentList = async () => {
  try {
    const response = await axios.get(`${API_URL}/appointments/recent`);
    return parseStringify(response.data);
  } catch (error: any) {
    console.error(
      "An error occurred while retrieving the recent appointments:",
      error.response?.data || error.message
    );
    return parseStringify({
      totalCount: 0,
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
      documents: []
    });
  }
};

//  UPDATE APPOINTMENT
export const updateAppointment = async ({
  appointmentId,
  userId,
  timeZone,
  appointment,
  type,
}: UpdateAppointmentParams) => {
  try {
    const response = await axios.put(`${API_URL}/appointments/${appointmentId}`, {
      userId,
      timeZone,
      appointment,
      type,
    });
    
    revalidatePath("/admin");
    return parseStringify(response.data);
  } catch (error: any) {
    console.error("An error occurred while scheduling an appointment:", error.response?.data || error.message);
  }
};

// GET APPOINTMENT
export const getAppointment = async (appointmentId: string) => {
  try {
    const response = await axios.get(`${API_URL}/appointments/${appointmentId}`);
    return parseStringify(response.data);
  } catch (error: any) {
    console.error(
      "An error occurred while retrieving the existing appointment:",
      error.response?.data || error.message
    );
  }
};
