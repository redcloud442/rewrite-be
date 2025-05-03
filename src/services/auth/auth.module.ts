import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { ClerkClientProvider } from "src/providers/clerk-client.provider";
import { ClerkStrategy } from "../../common/middlewares/clerk-auth.middleware";

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [ClerkStrategy, ClerkClientProvider],
  exports: [PassportModule],
})
export class AuthModule {}
