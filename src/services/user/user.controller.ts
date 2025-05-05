import { User } from "@clerk/backend";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ZodValidationPipe } from "src/common/pipe/zod.validationPipe";
import { CurrentUser } from "src/decorators/auth.decorator";
import { userOnboardingDto, userOnboardingDtoType } from "./dto/user-dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("onboarding")
  createUserOnboarding(
    @Body(new ZodValidationPipe(userOnboardingDto))
    body: userOnboardingDtoType,
    @CurrentUser() user: User
  ) {
    try {
      return this.userService.createUserOnboarding(body, user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  //   @Get()
  //   findAll() {
  //     return this.userService.findAll();
  //   }

  //   @Get(":id")
  //   findOne(@Param("id") id: string) {
  //     return this.userService.findOne(+id);
  //   }

  //   @Patch(":id")
  //   update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
  //     return this.userService.update(+id, updateUserDto);
  //   }

  //   @Delete(":id")
  //   remove(@Param("id") id: string) {
  //     return this.userService.remove(+id);
  //   }
}
