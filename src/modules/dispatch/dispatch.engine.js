import Responder from "../responders/responder.model.js";

export async function assignResponders(incident) {
  const responders = await Responder.find({
    isActive: true,
    currentIncident: null,
  }).limit(1);

  if (responders.length === 0) return [];

  const responder = responders[0];
  responder.currentIncident = incident._id;
  await responder.save();

  return [responder];
}
