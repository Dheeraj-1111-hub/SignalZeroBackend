import Incident from "../incidents/incident.model.js";
import { getIO } from "../../socket.js";

export async function updateResponderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body; // ON_SITE | RESOLVED

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    if (!["ON_SITE", "RESOLVED"].includes(status)) {
      return res.status(400).json({ error: "Invalid responder status" });
    }

    incident.status = status;

    incident.timeline.push({
      type: status.toLowerCase(),
      description: `Responder marked ${status}`,
    });

    if (status === "RESOLVED") {
      incident.sla.actualResponseMins =
        Math.ceil((Date.now() - incident.createdAt) / 60000);
      incident.sla.breached =
        incident.sla.actualResponseMins >
        incident.sla.expectedResponseMins;
    }

    await incident.save();

    const io = getIO();
    io.emit("incident:status", incident);

    res.json(incident);
  } catch (err) {
    next(err);
  }
}

/**
 * Ensure every OPERATOR has a responder profile
 */
export async function getOrCreateResponder(user) {
  let responder = await Responder.findOne({ user: user._id });

  if (!responder) {
    responder = await Responder.create({
      name: user.name || user.email,
      role: "POLICE", // default (can be extended later)
      user: user._id,
      isActive: true,
    });
  }

  return responder;
}

import Responder from "./responder.model.js";

/* ================= START SHIFT ================= */
export async function startShift(req, res, next) {
  try {
    const responder = await Responder.findOne({ user: req.user._id });
    if (!responder) return res.status(404).json({ error: "Responder not found" });

    responder.isOnDuty = true;
    responder.availability = "AVAILABLE";
    responder.shift = {
      start: new Date(),
      end: null,
    };

    await responder.save();
    res.json(responder);
  } catch (err) {
    next(err);
  }
}

/* ================= END SHIFT ================= */
export async function endShift(req, res, next) {
  try {
    const responder = await Responder.findOne({ user: req.user._id });
    if (!responder) return res.status(404).json({ error: "Responder not found" });

    responder.isOnDuty = false;
    responder.availability = "OFFLINE";
    responder.shift.end = new Date();
    responder.currentIncident = null;

    await responder.save();
    res.json(responder);
  } catch (err) {
    next(err);
  }
}



/* ================= GET ALL RESPONDERS ================= */
export async function getAllResponders(req, res, next) {
  try {
    const responders = await Responder.find()
      .populate("user", "email role status")
      .sort({ createdAt: -1 });

    res.json(responders);
  } catch (err) {
    next(err);
  }
}


/* ================= CREATE RESPONDER ================= */
export async function createResponder(req, res, next) {
  try {
    const { userId, role } = req.body;

    const exists = await Responder.findOne({ user: userId });
    if (exists) {
      return res.status(400).json({ error: "Responder already exists" });
    }

    const responder = await Responder.create({
      user: userId,
      name: "Responder",
      role,
      isOnDuty: false,
      availability: "OFFLINE",
    });

    res.status(201).json(responder);
  } catch (err) {
    next(err);
  }
}

/* ================= UPDATE RESPONDER ================= */
export async function updateResponder(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const responder = await Responder.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!responder) {
      return res.status(404).json({ error: "Responder not found" });
    }

    res.json(responder);
  } catch (err) {
    next(err);
  }
}

/* ================= DISABLE RESPONDER ================= */
export async function disableResponder(req, res, next) {
  try {
    const { id } = req.params;

    const responder = await Responder.findById(id);
    if (!responder) {
      return res.status(404).json({ error: "Responder not found" });
    }

    responder.isOnDuty = false;
    responder.availability = "OFFLINE";
    responder.currentIncident = null;

    await responder.save();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
