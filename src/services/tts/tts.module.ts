import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { AiModelModule } from "../ai-model/ai-model.module";
import { AwsModule } from "../aws/aws.module";
import { TtsController } from "./tts.controller";
import { TtsService } from "./tts.service";

@Module({
  imports: [AiModelModule, PrismaModule, AwsModule],
  controllers: [TtsController],
  providers: [TtsService],
  exports: [TtsService],
})
export class TtsModule {}
