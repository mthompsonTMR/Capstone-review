import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: String,
  gender: String,
  // other fields...
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
