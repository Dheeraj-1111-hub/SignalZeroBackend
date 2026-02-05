import mongoose from "mongoose";

const LearningSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["FALSE_POSITIVE_PATTERN"],
      required: true,
    },

    source: String,
    severity: String,

    insight: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Learning", LearningSchema);
