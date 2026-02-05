import { recalibrateConfidence } from "./recalibration.engine.js";

/**
 * Base AI confidence (Phase 6 logic)
 */
export function calculateBaseConfidence(incident) {
  let score = 0;

  // Severity weight
  if (incident.severity === "CRITICAL") score += 50;
  if (incident.severity === "HIGH") score += 35;
  if (incident.severity === "MEDIUM") score += 20;
  if (incident.severity === "LOW") score += 10;

  // Source reliability
  if (incident.source === "SENSOR") score += 20;
  if (incident.source === "CAMERA") score += 15;
  if (incident.source === "CITIZEN") score += 5;

  // Description quality
  if (incident.description && incident.description.length > 30) {
    score += 10;
  }

  return Math.min(score, 90); // base confidence cap
}

/**
 * Final AI confidence with learning feedback
 */
export async function calculateAIConfidence(incident) {
  const baseConfidence = calculateBaseConfidence(incident);

  const finalConfidence = await recalibrateConfidence(
    incident,
    baseConfidence
  );

  return Math.round(finalConfidence);
}
