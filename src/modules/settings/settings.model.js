import mongoose from "mongoose";

const SystemSettingsSchema = new mongoose.Schema(
  {
    autoDispatch: {
      enabled: { type: Boolean, default: false },
      minConfidence: { type: Number, default: 90 },
    },

    notifications: {
      realtime: { type: Boolean, default: true },
    },

    monitoring: {
      socialMedia: { type: Boolean, default: true },
    },

    escalation: {
      enabled: { type: Boolean, default: true },
    },

    dataRetentionDays: {
      type: Number,
      default: 90,
    },
  },
  { timestamps: true }
);

// Singleton pattern (only ONE document)
SystemSettingsSchema.statics.getSingleton = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model("SystemSettings", SystemSettingsSchema);
