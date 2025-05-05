import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodTypeAny } from "zod";

@Injectable()
export class ZodValidationPipe<T, ZodSchema extends ZodTypeAny>
  implements PipeTransform
{
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }
    return result.data as T;
  }
}
