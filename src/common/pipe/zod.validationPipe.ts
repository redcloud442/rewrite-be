import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { ZodTypeAny } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodTypeAny) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(result.error.flatten());
    }
    return result.data as T;
  }
}
