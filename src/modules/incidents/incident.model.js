import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, default: "" },
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "LOW",
    },

    source: {
      type: String,
      enum: ["CITIZEN", "SENSOR", "SOCIAL", "CAMERA"],
      required: true,
    },

    confidence: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["OPEN", "VERIFIED", "DISPATCHED", "RESOLVED"],
      default: "OPEN",
    },

    responderEta: {
      type: Number,
    },

    assignedResponders: {
      type: [String],
      default: [],
    },

    aiExplanation: {
      type: String,
    },

    timeline: [
      {
        type: {
          type: String,
          required: true,
        },
        description: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    sla: {
  expectedResponseMins: {
    type: Number,
    default: 10,
  },
  actualResponseMins: Number,
  breached: {
    type: Boolean,
    default: false,
  },
  
},

  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// 🔥 IMPORTANT INDEXES
IncidentSchema.index({ "location.lat": 1, "location.lng": 1 });
IncidentSchema.index({ severity: 1 });
IncidentSchema.index({ status: 1 });
IncidentSchema.index({ createdAt: -1 });

export default mongoose.model("Incident", IncidentSchema);
