import Incident from "../incidents/incident.model.js";
import { dispatchQueue } from "../../queues/dispatch.queue.js";

export async function enqueueDispatch(req, res, next) {
  try {
    const { id } = req.params;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    if (incident.status === "DISPATCHED") {
      return res.status(400).json({ error: "Already dispatched" });
    }

    await dispatchQueue.add("dispatch-incident", {
      incidentId: id,
    });

    res.json({ queued: true });
  } catch (err) {
    next(err);
  }
}
