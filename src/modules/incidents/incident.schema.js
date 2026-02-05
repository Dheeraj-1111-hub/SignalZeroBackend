import { z } from "zod";

export const createIncidentSchema = z.object({
  title: z.string().min(5),
  description: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }),
  source: z.enum(["CITIZEN", "SENSOR", "SOCIAL", "CAMERA"]),
});
