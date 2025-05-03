import { Injectable } from "@nestjs/common";

import { User } from "@clerk/backend";
import { OpenaiService } from "../openai/openai.service";
import { aiModelDtoType } from "./dto/ai-model.dto";

@Injectable()
export class AiModelService {
  constructor(
    // private readonly prisma: PrismaService,
    private readonly openaiService: OpenaiService
  ) {}

  async create(text: string) {
    const response = await this.openaiService.chatGptRequest(
      "You are a helpful assistant that can answer questions and help with tasks.",
      [
        {
          text: "Generate a summary for the following text: " + text,
          ai: false,
        },
      ]
    );

    return {
      text: response,
      ai: true,
    };
  }

  async askAi(aiModelDto: aiModelDtoType, user: User) {
    const { message } = aiModelDto;
    const response = await this.openaiService.chatGptRequest(
      `Hi I am ${user.firstName}. You are a helpful assistant that can answer questions and help with tasks.`,
      [
        {
          text: message,
          ai: false,
        },
      ]
    );

    return {
      text: response,
      ai: true,
    };
  }

  findAll() {
    return `This action returns all aiModel`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aiModel`;
  }

  update(id: number) {
    return `This action updates a #${id} aiModel`;
  }

  remove(id: number) {
    return `This action removes a #${id} aiModel`;
  }
}
