import Responder from "./responder.model.js";

export async function assignResponders(incident) {
  const responders = await Responder.find({
    isOnDuty: true,
    availability: "AVAILABLE",
    currentIncident: null,
  }).limit(1);

  if (!responders.length) return [];

  const responder = responders[0];

  responder.currentIncident = incident._id;
  responder.availability = "BUSY";

  await responder.save();
  return [responder];
}
