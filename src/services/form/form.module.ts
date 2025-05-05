import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { FormController } from "./form.controller";
import { FormService } from "./form.service";

@Module({
  imports: [PrismaModule],
  controllers: [FormController],
  providers: [FormService],
  exports: [FormService],
})
export class FormModule {}
