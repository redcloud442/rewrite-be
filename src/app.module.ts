import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import {
  PrismaReadReplicaService,
  PrismaService,
} from "./prisma/prisma.service";
import { ClerkClientProvider } from "./providers/clerk-client.provider";
import { AiModelService } from "./services/ai-model/ai-model.service";
import { AuthModule } from "./services/auth/auth.module";
import { ClerkAuthGuard } from "./services/auth/clerk-auth.guard";
import { FormModule } from "./services/form/form.module";
import { FormService } from "./services/form/form.service";
import { OpenaiService } from "./services/openai/openai.service";
import { SupabaseService } from "./services/supabase/supabase.service";
import { TtsModule } from "./services/tts/tts.module";
import { UserModule } from "./services/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TtsModule,
    FormModule,
    PrismaModule,
    AuthModule,
    UserModule,
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
    PrismaReadReplicaService,
    AiModelService,
    OpenaiService,
    FormService,
    SupabaseService,
  ],
})
export class AppModule {}
