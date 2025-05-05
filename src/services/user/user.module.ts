import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ClerkClientProvider } from "src/providers/clerk-client.provider";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, ClerkClientProvider],
})
export class UserModule {}
