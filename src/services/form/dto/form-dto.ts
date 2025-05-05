import { z } from "zod";

export const formDto = z.object({
  id: z.string(),
  index: z.number().optional(),
});

export type formDtoType = z.infer<typeof formDto>;
