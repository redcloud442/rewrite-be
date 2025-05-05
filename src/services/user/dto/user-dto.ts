import { z } from "zod";

export const userOnboardingDto = z.array(
  z.object({
    field_id: z.string().uuid(),
    response_value: z.coerce.string().min(1),
    response_user_id: z.string(),
  })
);

export type userOnboardingDtoType = z.infer<typeof userOnboardingDto>;
