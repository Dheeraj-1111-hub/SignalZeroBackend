import SystemSettings from "./settings.model.js";

/* ================= GET SETTINGS ================= */
export async function getSettings(req, res, next) {
  try {
    const settings = await SystemSettings.getSingleton();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

/* ================= UPDATE SETTINGS ================= */
export async function updateSettings(req, res, next) {
  try {
    const settings = await SystemSettings.getSingleton();

    const {
      autoDispatch,
      notifications,
      monitoring,
      escalation,
      dataRetentionDays,
    } = req.body;

    if (autoDispatch) {
      settings.autoDispatch = {
        ...settings.autoDispatch,
        ...autoDispatch,
      };
    }

    if (notifications) {
      settings.notifications = {
        ...settings.notifications,
        ...notifications,
      };
    }

    if (monitoring) {
      settings.monitoring = {
        ...settings.monitoring,
        ...monitoring,
      };
    }

    if (escalation) {
      settings.escalation = {
        ...settings.escalation,
        ...escalation,
      };
    }

    if (typeof dataRetentionDays === "number") {
      settings.dataRetentionDays = dataRetentionDays;
    }

    await settings.save();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}
