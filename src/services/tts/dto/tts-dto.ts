import { z } from "zod";

export const generateAudioDto = z.object({
  voice: z.string().optional(),
  language: z.string().optional(),
});

export type generateAudioDtoType = z.infer<typeof generateAudioDto>;
