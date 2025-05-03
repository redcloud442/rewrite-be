import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";
import { ClerkClientProvider } from "./providers/clerk-client.provider";
import { AiModelService } from "./services/ai-model/ai-model.service";
import { AuthModule } from "./services/auth/auth.module";
import { ClerkAuthGuard } from "./services/auth/clerk-auth.guard";
import { OpenaiService } from "./services/openai/openai.service";
import { SupabaseService } from "./services/supabase/supabase.service";
import { TtsModule } from "./services/tts/tts.module";
import { FormService } from './services/form/form.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TtsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ClerkClientProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
    PrismaService,
    AiModelService,
    OpenaiService,
    SupabaseService,
    FormService,
  ],
})
export class AppModule {}
