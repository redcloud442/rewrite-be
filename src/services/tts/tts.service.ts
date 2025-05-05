import {
  LanguageCode,
  PollyClient,
  SynthesizeSpeechCommand,
  VoiceId,
} from "@aws-sdk/client-polly";
import { Injectable } from "@nestjs/common";
import { User } from "@supabase/supabase-js";
import {
  PrismaReadReplicaService,
  PrismaService,
} from "src/prisma/prisma.service";
import { AwsService } from "../aws/aws.service";
import { getMessagesDtoType } from "./dto/tts-dto";

@Injectable()
export class TtsService {
  constructor(
    private prisma: PrismaReadReplicaService,
    private prismaWrite: PrismaService,
    private awsService: AwsService,
    private polly: PollyClient
  ) {}

  async postTts(params: {
    text: string;
    voice?: string;
    language?: string;
    file: Express.Multer.File;
    user: User;
  }): Promise<{ id: string; audioName: string; audioUrl: string }> {
    try {
      const { voice, language, text, file, user } = params;

      const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: (voice as VoiceId) || "Joanna",
        LanguageCode: (language as LanguageCode) || "en-US",
      });

      const response = await this.polly.send(command);

      if (!response.AudioStream) {
        throw new Error("No AudioStream received from Polly.");
      }

      const chunks: Uint8Array[] = [];
      const audioStream =
        response.AudioStream as unknown as NodeJS.ReadableStream;

      // ✅ Read the Polly stream into a buffer
      for await (const chunk of audioStream) {
        chunks.push(chunk as Uint8Array);
      }

      const audioBuffer = Buffer.concat(chunks);

      const key = `AUDIO_FILES/${file.originalname}`;
      const url = await this.awsService.uploadBuffer(audioBuffer, key);

      const recording = await this.prismaWrite.user_recording_table.create({
        data: {
          recording_user_id: user.id,
          recording_url: url,
          recording_name: file.originalname,
        },
      });

      const returnData = {
        id: recording.recording_id,
        audioName: recording.recording_name,
        audioUrl: recording.recording_url,
      };

      return returnData;
    } catch (error) {
      console.error("Polly error:", error);
      throw new Error("Error synthesizing speech");
    }
  }

  async createMessage(
    messages: {
      message_user_id: string;
      message_recording: string;
      message_recording_id: string;
      message_is_ai: boolean;
    }[]
  ) {
    await this.prismaWrite.user_message_recording_table.createMany({
      data: messages,
    });

    return messages;
  }

  async getRecordings(user: User) {
    const recordings = await this.prisma.user_recording_table.findMany({
      where: { recording_user_id: user.id },
      select: {
        recording_id: true,
        recording_url: true,
        recording_name: true,
      },
      take: 10,
      orderBy: { recording_created_at: "desc" },
    });

    const formattedRecordings = recordings.map((recording) => {
      return {
        id: recording.recording_id,
        audioName: recording.recording_name,
        audioUrl: recording.recording_url,
      };
    });

    return formattedRecordings;
  }

  async getMessages(user: User, query: getMessagesDtoType) {
    const { recordingId, take, skip } = query;

    const offset = (skip - 1) * take;

    const messages = await this.prisma.user_message_recording_table.findMany({
      where: {
        message_user_id: user.id,
        message_recording_id: recordingId,
      },
      select: {
        message_recording: true,
        message_recording_id: true,
        message_created_at: true,
        message_is_ai: true,
      },
      orderBy: { message_created_at: "asc" },
      take: take,
      skip: offset,
    });

    const formattedMessages = messages.map((message) => {
      return {
        message: message.message_recording,
        ai: message.message_is_ai,
      };
    });

    return formattedMessages;
  }
}
