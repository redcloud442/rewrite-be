import { Module } from "@nestjs/common";
import { AiModelModule } from "../ai-model/ai-model.module";
import { SupabaseModule } from "../supabase/supabase.module";
import { TtsController } from "./tts.controller";
import { TtsService } from "./tts.service";

@Module({
  imports: [AiModelModule, SupabaseModule],
  controllers: [TtsController],
  providers: [TtsService],
  exports: [TtsService],
})
export class TtsModule {}
