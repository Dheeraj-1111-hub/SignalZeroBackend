import { telemetry } from "../modules/telemetry/telemetry.state.js";

export function latencyMiddleware(req, res, next) {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1_000_000;

    // store last 100 values only
    telemetry.apiLatency.push(ms);
    if (telemetry.apiLatency.length > 100) {
      telemetry.apiLatency.shift();
    }

    // update API Gateway latency
    const api = telemetry.services.find(
      (s) => s.name === "API Gateway"
    );
    if (api) {
      api.latency = Math.round(ms);
    }
  });

  next();
}
