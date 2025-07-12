import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  pmSerialNumber: { type: String, required: true },
  caseId: { type: String },
  runId: { type: String },
  slideId: { type: String },
  createdBy: { type: String },
  processDate: { type: Date },
  markerName: { type: String },
  active: { type: Boolean, default: true },

  // Optional/Extended fields
  tissueType: { type: String },
  stainType: { type: String },
  status: { type: String },
  comments: { type: String },
  stainingProtocol: { type: String },
  detectionSystem: { type: String },
  detectionKitSerial: { type: String }
}, { timestamps: true });

export default mongoose.models.Slide || mongoose.model("Slide", slideSchema);
