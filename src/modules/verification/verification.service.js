import Incident from "../incidents/incident.model.js";
import { getIO } from "../../socket.js";
import { generateAIExplanation } from "../ai/explanation.engine.js";

export async function verifyIncident(req, res, next) {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    if (incident.status !== "OPEN") {
      return res.status(400).json({ error: "Incident not open" });
    }

    incident.status = "VERIFIED";
    incident.aiExplanation = await generateAIExplanation(incident);

    incident.timeline.push({
      type: "verified",
      description: "Incident verified by operator",
    });

    await incident.save();

    const io = getIO();
    io.emit("incident:status", incident);

    res.json(incident);
  } catch (err) {
    next(err);
  }
}

export async function rejectIncident(req, res, next) {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    incident.status = "RESOLVED";
    incident.timeline.push({
      type: "rejected",
      description: "Incident rejected during verification",
    });

    await incident.save();

    const io = getIO();
    io.emit("incident:status", incident);

    res.json(incident);
  } catch (err) {
    next(err);
  }
}
