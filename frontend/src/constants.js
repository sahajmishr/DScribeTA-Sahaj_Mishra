export const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export const GENDERS = ["Male", "Female", "Other"];

export const WARDS = ["General Ward", "ICU", "Private Room", "Emergency"];

export const DEPARTMENTS = [
  "General Medicine",
  "Cardiology",
  "Orthopaedics",
  "Pediatrics",
];

export const DOCTORS = [
  "Dr. Meera Shah",
  "Dr. Arjun Rao",
  "Dr. Neha Sen",
  "Dr. Vikram Nair",
];

export const STATUSES = ["Admitted", "Discharged"];