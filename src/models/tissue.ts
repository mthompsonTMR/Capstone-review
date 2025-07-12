import mongoose from "mongoose";

const tissueSchema = new mongoose.Schema({
  tissueId: { type: String, required: true },
  imageUrl: String,
  diagnosis: String,
  notes: String,
  stainedSlideId: String,

  // ✅ New fields for tracking updates
  active: { type: Boolean, default: true }, // Marks the record as current or outdated
  replacesId: { type: mongoose.Schema.Types.ObjectId, ref: "Tissue" }, // Optional back-reference
}, { timestamps: true });

const Tissue = mongoose.models.Tissue || mongoose.model("Tissue", tissueSchema);
export default Tissue;

