import Learning from "./learning.model.js";
import { analyzeFalsePositive } from "../ai/falsePositive.engine.js";

export async function learnFromFalsePositive(incident) {
  const insight = await analyzeFalsePositive(incident);

  await Learning.create({
    type: "FALSE_POSITIVE_PATTERN",
    source: incident.source,
    severity: incident.severity,
    insight,
  });
}
