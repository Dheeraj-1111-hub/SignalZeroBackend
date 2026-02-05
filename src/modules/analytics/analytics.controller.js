import { buildAnalytics } from "./analytics.service.js";

export async function getAnalytics(req, res, next) {
  try {
    const data = await buildAnalytics();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
