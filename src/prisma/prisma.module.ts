import { Module } from "@nestjs/common";
import { PrismaReadReplicaService, PrismaService } from "./prisma.service";

@Module({
  providers: [PrismaService, PrismaReadReplicaService],
  exports: [PrismaService, PrismaReadReplicaService],
})
export class PrismaModule {}
