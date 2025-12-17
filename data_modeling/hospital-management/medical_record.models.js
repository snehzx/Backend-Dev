import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    alergies: {
      type: String,
      required: true,
    },
    metrics: {
      height: Number,
      weight: Number,
      required: true,
    },
    pastProblems: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const medicalRecord = mongoose.model(
  "medicalRecord",
  medicalRecordSchema
);
