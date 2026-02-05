import Incident from "../incidents/incident.model.js";
import { calculatePriority } from "./priority.engine.js";
import { routeIncident } from "./routing.engine.js";
import { getIO } from "../../socket.js";

export async function dispatchIncident(req, res, next) {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    if (incident.status !== "VERIFIED") {
      return res.status(400).json({
        error: "Incident must be VERIFIED before dispatch",
      });
    }

    /* ---------- PRIORITY & ROUTING ---------- */
    const priorityScore = calculatePriority(incident);
    const responders = await routeIncident(incident);

    /* ---------- SLA ---------- */
    const responseMins = Math.ceil(
      (Date.now() - incident.createdAt) / 60000
    );

    incident.sla = {
      expectedResponseMins: 10,
      actualResponseMins: responseMins,
      breached: responseMins > 10,
    };

    /* ---------- ASSIGN ---------- */
    incident.assignedResponders = responders.map((r) => r.name);
    incident.responderEta = Math.floor(Math.random() * 8) + 4;
    incident.status = "DISPATCHED";

    incident.timeline.push({
      type: "dispatched",
      description: `Dispatched with priority ${priorityScore}`,
    });

    await incident.save();

    const io = getIO();
    io.emit("incident:dispatch", incident);
    io.emit("incident:status", incident);

    if (incident.sla.breached) {
      io.emit("sla:breach", {
        incidentId: incident._id,
        responseMins,
      });
    }

    res.json(incident);
  } catch (err) {
    next(err);
  }
}
