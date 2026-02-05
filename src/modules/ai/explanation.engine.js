export function generateAIExplanation(incident, confidence) {
  const reasons = [];

  if (incident.source === "SENSOR") {
    reasons.push("Detected by an automated sensor with high reliability");
  }

  if (incident.source === "CAMERA") {
    reasons.push("Visual confirmation from camera feed");
  }

  if (incident.severity === "CRITICAL") {
    reasons.push("Incident classified as critical based on reported data");
  }

  if (incident.description?.length > 40) {
    reasons.push("Detailed description provided by the reporter");
  }

  if (incident.location?.lat && incident.location?.lng) {
    reasons.push("Exact geolocation available for rapid response");
  }

  return `
This incident has an AI confidence score of ${confidence}%.
The score is based on ${reasons.join(", ")}.
The system recommends immediate attention.
`.trim();
}
