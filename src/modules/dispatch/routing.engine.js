// src/modules/dispatch/routing.engine.js

import Responder from "../responders/responder.model.js";

function distance(a, b) {
  return Math.sqrt(
    Math.pow(a.lat - b.lat, 2) +
    Math.pow(a.lng - b.lng, 2)
  );
}

export async function routeIncident(incident) {
  const responders = await Responder.find({ available: true });

  if (!responders.length) return [];

  return responders
    .map((r) => ({
      responder: r,
      dist: distance(incident.location, r.location),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 2)
    .map((r) => r.responder);
}
