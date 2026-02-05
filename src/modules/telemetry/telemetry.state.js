export const telemetry = {
  apiLatency: [],
  incidentCount: 0,

  ai: {
    calls: 0,
    totalLatency: 0,
    failures: 0,
  },

  dispatch: {
    calls: 0,
    totalLatency: 0,
    failures: 0,
  },
  services: [
    { name: "API Gateway", latency: 0, status: "operational" },
    { name: "Dispatch Engine", latency: 0, status: "operational" },
  ],
};

