import { callGroq } from "./groq.client.js";

export async function analyzeFalsePositive(incident) {
  const prompt = `
An emergency incident was flagged as FALSE POSITIVE.

Incident data:
- Title: ${incident.title}
- Severity: ${incident.severity}
- Source: ${incident.source}
- Confidence: ${incident.confidence}
- Description: ${incident.description}

Explain why this might be a false positive and suggest patterns to avoid similar mistakes in the future.
`;

  return await callGroq(prompt);
}
