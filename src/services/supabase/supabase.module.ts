import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SupabaseService } from "./supabase.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
