import { Injectable, NotFoundException } from "@nestjs/common";
import {
  PrismaReadReplicaService,
  PrismaService,
} from "src/prisma/prisma.service";
import { formDtoType } from "./dto/form-dto";

@Injectable()
export class FormService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaReadReplica: PrismaReadReplicaService
  ) {}

  async findOne(formDto: formDtoType) {
    const { id } = formDto;
    const form = await this.prismaReadReplica.form_table.findUnique({
      where: { form_id: id },
      include: {
        sections: {
          include: {
            fields: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    });

    if (!form) {
      throw new NotFoundException("Form not found");
    }

    const formSections = {
      ...form,
      sections: form.sections.map((section) => ({
        ...section,
        fields: section.fields,
      })),
    };

    return formSections;
  }
}
