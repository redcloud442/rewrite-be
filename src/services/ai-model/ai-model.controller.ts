import { User } from "@clerk/backend";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { ZodValidationPipe } from "src/common/pipe/zod.validationPipe";
import { CurrentUser } from "src/decorators/auth.decorator";
import { AiModelService } from "./ai-model.service";
import { aiModelDto, aiModelDtoType } from "./dto/ai-model.dto";

@Controller("ai-model")
export class AiModelController {
  constructor(private readonly aiModelService: AiModelService) {}

  @Post()
  create(@Body() text: string) {
    return this.aiModelService.create(text);
  }

  @Post("ask-ai")
  async askAi(
    @Body(new ZodValidationPipe(aiModelDto))
    aiModelDto: aiModelDtoType,
    @Res() res: Response,
    @CurrentUser() user: User
  ) {
    try {
      const response = await this.aiModelService.askAi(aiModelDto, user);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Get()
  findAll() {
    return this.aiModelService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.aiModelService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string) {
    return this.aiModelService.update(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.aiModelService.remove(+id);
  }
}
