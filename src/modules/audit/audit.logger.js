import AuditLog from "./audit.model.js";

export async function logAudit({
  req,
  action,
  entityType,
  entityId,
  metadata = {},
}) {
  try {
    await AuditLog.create({
      action,

      actor: req.user
        ? {
            id: req.user._id,
            role: req.user.role,
            email: req.user.email,
          }
        : null,

      entity: {
        type: entityType,
        id: entityId,
      },

      metadata,

      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });
  } catch (err) {
    // 🔥 NEVER break main flow
    console.error("Audit log failed:", err.message);
  }
}
