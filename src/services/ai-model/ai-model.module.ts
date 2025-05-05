import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { OpenaiModule } from "../openai/openai.module";
import { AiModelController } from "./ai-model.controller";
import { AiModelService } from "./ai-model.service";

@Module({
  imports: [OpenaiModule, PrismaModule],
  controllers: [AiModelController],
  providers: [AiModelService],
  exports: [AiModelService],
})
export class AiModelModule {}
