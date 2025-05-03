import { Module } from "@nestjs/common";
import { OpenaiModule } from "../openai/openai.module";
import { AiModelController } from "./ai-model.controller";
import { AiModelService } from "./ai-model.service";
@Module({
  imports: [OpenaiModule],
  controllers: [AiModelController],
  providers: [AiModelService],
  exports: [AiModelService],
})
export class AiModelModule {}
