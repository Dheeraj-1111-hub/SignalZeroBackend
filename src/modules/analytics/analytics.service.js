import Incident from "../incidents/incident.model.js";

export async function buildAnalytics() {
  const totalIncidents = await Incident.countDocuments();

  const slaBreaches = await Incident.countDocuments({
    "sla.breached": true,
  });

  const avgResponseAgg = await Incident.aggregate([
    { $match: { "sla.actualResponseMins": { $exists: true } } },
    {
      $group: {
        _id: null,
        avg: { $avg: "$sla.actualResponseMins" },
      },
    },
  ]);

  const heatmap = await Incident.aggregate([
    {
      $group: {
        _id: {
          lat: "$location.lat",
          lng: "$location.lng",
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return {
    totalIncidents,
    slaBreaches,
    avgResponseMins: Math.round(avgResponseAgg[0]?.avg || 0),
    heatmap,
  };
}
