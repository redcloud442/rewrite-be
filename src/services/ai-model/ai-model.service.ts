import { Injectable } from "@nestjs/common";

import { User } from "@clerk/backend";
import {
  PrismaReadReplicaService,
  PrismaService,
} from "src/prisma/prisma.service";
import { OpenaiService } from "../openai/openai.service";
import { aiModelDtoType } from "./dto/ai-model.dto";

@Injectable()
export class AiModelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly prismaRead: PrismaReadReplicaService,
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
    const { message, selectedRecordingId } = aiModelDto;
    // Step 1: Get the recording ID
    let recordingId: string | null = selectedRecordingId;

    if (!recordingId) {
      const latestRecording =
        await this.prismaRead.user_recording_table.findFirst({
          where: { recording_user_id: user.id },
          select: { recording_id: true },
          orderBy: { recording_created_at: "desc" },
        });

      recordingId = latestRecording?.recording_id || null;
    }

    const responseText = await this.openaiService.chatGptRequest(
      `Hi I am ${user.firstName}. You are a helpful assistant that can answer questions and help with tasks.`,
      [{ text: message, ai: false }]
    );

    const userMessage = {
      message_user_id: user.id,
      message_recording: message,
      message_recording_id: recordingId || "",
      message_is_ai: false,
    };

    const aiMessage = {
      message_user_id: user.id,
      message_recording: responseText,
      message_recording_id: recordingId || "",
      message_is_ai: true,
    };

    await this.prisma.user_message_recording_table.createMany({
      data: [userMessage, aiMessage],
    });

    return {
      text: responseText,
      ai: true,
    };
  }

  //   findAll() {
  //     return `This action returns all aiModel`;
  //   }

  //   findOne(id: number) {
  //     return `This action returns a #${id} aiModel`;
  //   }

  //   update(id: number) {
  //     return `This action updates a #${id} aiModel`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} aiModel`;
  //   }
}
