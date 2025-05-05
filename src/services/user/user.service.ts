import { createClerkClient, User } from "@clerk/backend";
import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { userOnboardingDtoType } from "./dto/user-dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject("ClerkClient")
    private readonly clerkClient: ReturnType<typeof createClerkClient>
  ) {}

  async createUserOnboarding(createUserDto: userOnboardingDtoType, user: User) {
    const data = await this.prisma.$transaction(async (tx) => {
      await tx.user_table.upsert({
        where: {
          user_id: user.id,
        },
        update: {},
        create: {
          user_id: user.id,
          user_first_name: createUserDto[0].response_value,
          user_last_name: createUserDto[1].response_value,
          user_email: user.emailAddresses[0].emailAddress,
        },
      });
      await tx.user_form_response_table.createMany({
        data: createUserDto.map((item) => ({
          response_value: item.response_value,
          response_user_id: item.response_user_id,
          response_field_id: item.field_id,
        })),
      });
      return { message: "User onboarding created successfully" };
    });

    if (data) {
      await this.clerkClient.users.updateUser(user.id, {
        publicMetadata: {
          onboardingComplete: true,
        },
      });
    }

    return { message: "User onboarding created successfully" };
  }

  //   findAll() {
  //     return `This action returns all user`;
  //   }

  //   findOne(id: number) {
  //     return `This action returns a #${id} user`;
  //   }

  //   update(id: number, updateUserDto: UpdateUserDto) {
  //     return `This action updates a #${id} user`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} user`;
  //   }
}
