import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { formDtoType } from "./dto/form-dto";
import { FormService } from "./form.service";

@Controller("form")
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get()
  getHello(): string {
    return "Hello World";
  }

  @Get(":id")
  findOne(@Param() formDto: formDtoType) {
    try {
      return this.formService.findOne(formDto);
    } catch (error) {
      console.log(error);
      throw new NotFoundException("Form not found");
    }
  }
}
