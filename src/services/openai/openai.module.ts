import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OpenaiService } from "./openai.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
  ],
  controllers: [],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
