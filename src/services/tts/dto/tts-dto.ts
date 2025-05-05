import { z } from "zod";

export const generateAudioDto = z.object({
  voice: z.string().optional(),
  language: z.string().optional(),
});

export type generateAudioDtoType = z.infer<typeof generateAudioDto>;

export const getMessagesDto = z.object({
  recordingId: z.string().uuid(),
  take: z.coerce.number().min(1).max(15),
  skip: z.coerce.number().min(0),
});

export type getMessagesDtoType = z.infer<typeof getMessagesDto>;
