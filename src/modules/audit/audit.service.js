import AuditLog from "./audit.model.js";

/* ================= GET AUDIT LOGS ================= */
export async function getAuditLogs(req, res, next) {
  try {
    const { limit = 50, action, entityType } = req.query;

    const query = {};
    if (action) query.action = action;
    if (entityType) query["entity.type"] = entityType;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json(logs);
  } catch (err) {
    next(err);
  }
}
