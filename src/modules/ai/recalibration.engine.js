import Learning from "../learning/learning.model.js";

/**
 * Reduce confidence based on learned false-positive patterns
 */
export async function recalibrateConfidence(incident, baseConfidence) {
  let adjustedConfidence = baseConfidence;

  // Fetch similar false positives
  const similarFalsePositives = await Learning.find({
    type: "FALSE_POSITIVE_PATTERN",
    source: incident.source,
    severity: incident.severity,
  }).limit(5);

  if (similarFalsePositives.length === 0) {
    return adjustedConfidence; // no penalty
  }

  /**
   * Penalty logic:
   * - Each similar false positive reduces confidence
   * - Max reduction capped to avoid over-penalizing
   */
  const penalty = Math.min(similarFalsePositives.length * 8, 25);

  adjustedConfidence -= penalty;

  return Math.max(adjustedConfidence, 5); // never drop below 5%
}
