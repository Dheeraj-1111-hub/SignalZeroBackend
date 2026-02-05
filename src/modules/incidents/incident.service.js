import Incident from "./incident.model.js";
import { createIncidentSchema } from "./incident.schema.js";
import { getIO } from "../../socket.js";
import { telemetry } from "../telemetry/telemetry.state.js";
import { aiQueue } from "../../queues/ai.queue.js";
import { dispatchQueue } from "../../queues/dispatch.queue.js";
import Responder from "../responders/responder.model.js";
import { logAudit } from "../audit/audit.logger.js";

/* =====================================================
   GET INCIDENTS (ROLE AWARE)
   ===================================================== */
export async function getIncidents(req, res, next) {
  try {
    const role = req.user.role;

    const query =
      role === "CITIZEN"
        ? { status: { $in: ["OPEN", "VERIFIED"] } }
        : { status: { $ne: "RESOLVED" } };

    const incidents = await Incident.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(incidents);
  } catch (err) {
    next(err);
  }
}

/* =====================================================
   GET INCIDENT BY ID
   ===================================================== */
export async function getIncidentById(req, res, next) {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }
    res.json(incident);
  } catch (err) {
    next(err);
  }
}

/* =====================================================
   CREATE INCIDENT (CITIZEN)
   ===================================================== */
export async function createIncident(req, res, next) {
  try {
    const parsed = createIncidentSchema.parse(req.body);
    telemetry.incidentCount++;

    const incident = await Incident.create({
      ...parsed,
      confidence: 0,
      status: "OPEN",
      createdBy: req.user._id,
      timeline: [
        {
          type: "reported",
          description: "Incident reported",
          timestamp: new Date(),
        },
      ],
    });

    await aiQueue.add("ai-confidence", {
      incidentId: incident._id.toString(),
      payload: parsed,
    });

    /* 🔍 AUDIT */
    await logAudit({
      req,
      action: "INCIDENT_CREATED",
      entityType: "Incident",
      entityId: incident._id,
      metadata: {
        severity: incident.severity,
        source: incident.source,
      },
    });

    getIO().emit("incident:new", incident);
    res.status(201).json(incident);
  } catch (err) {
    next(err);
  }
}

/* =====================================================
   UPDATE INCIDENT STATUS
   ===================================================== */
export async function updateIncidentStatus(req, res, next) {
  try {
    const { status } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    incident.status = status;
    incident.timeline.push({
      type: status.toLowerCase(),
      description: `Incident ${status.toLowerCase()}`,
      timestamp: new Date(),
    });

    await incident.save();

    /* 🔍 AUDIT */
    await logAudit({
      req,
      action: "INCIDENT_STATUS_UPDATED",
      entityType: "Incident",
      entityId: incident._id,
      metadata: { newStatus: status },
    });

    if (status === "VERIFIED") {
      await dispatchQueue.add("dispatch", {
        incidentId: incident._id.toString(),
      });
    }

    const io = getIO();
    io.emit("incident:status", incident);
    io.emit("incident:timeline:add", incident);

    res.json(incident);
  } catch (err) {
    next(err);
  }
}

/* =====================================================
   ADD TIMELINE ENTRY
   ===================================================== */
export async function addIncidentTimeline(req, res, next) {
  try {
    const { description, type = "note" } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          timeline: { type, description, timestamp: new Date() },
        },
      },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    getIO().emit("incident:timeline:add", incident);
    res.json(incident);
  } catch (err) {
    next(err);
  }
}

/* =====================================================
   MANUAL RESPONDER ASSIGNMENT
   ===================================================== */
export async function assignResponderManually(req, res, next) {
  try {
    const { responderId } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    const responder = await Responder.findById(responderId);
    if (!responder || responder.currentIncident) {
      return res.status(400).json({ error: "Responder unavailable" });
    }

    responder.currentIncident = incident._id;
    await responder.save();

    incident.status = "DISPATCHED";
    incident.assignedResponders = [responder.name];
    incident.timeline.push({
      type: "dispatched",
      description: `Manually assigned to ${responder.name}`,
      timestamp: new Date(),
    });

    await incident.save();

    /* 🔍 AUDIT */
    await logAudit({
      req,
      action: "RESPONDER_ASSIGNED_MANUALLY",
      entityType: "Incident",
      entityId: incident._id,
      metadata: {
        responderId,
        responderName: responder.name,
      },
    });

    const io = getIO();
    io.emit("responder:assigned", {
      id: incident._id,
      title: incident.title,
      severity: incident.severity,
      address: incident.location.address,
      responderEta: incident.responderEta ?? 5,
    });

    io.emit("incident:status", incident);
    res.json(incident);
  } catch (err) {
    next(err);
  }
}
