export function calculatePriority(incident) {
  let score = 0;

  if (incident.severity === "CRITICAL") score += 50;
  if (incident.severity === "HIGH") score += 30;
  if (incident.severity === "MEDIUM") score += 15;

  if (incident.source === "CAMERA") score += 10;
  if (incident.source === "SENSOR") score += 5;

  if (incident.confidence >= 80) score += 20;
  else if (incident.confidence >= 60) score += 10;

  return score;
}
