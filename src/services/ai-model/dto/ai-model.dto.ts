import { z } from "zod";

export const aiModelDto = z.object({
  message: z.string().min(1, "Message is necessary to ask the AI."),
});

export type aiModelDtoType = z.infer<typeof aiModelDto>;
