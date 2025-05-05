import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "@supabase/supabase-js";
import { Response } from "express";
import { ZodValidationPipe } from "src/common/pipe/zod.validationPipe";
import { CurrentUser } from "src/decorators/auth.decorator";
import { textParser } from "src/functions/function";
import { AiModelService } from "../ai-model/ai-model.service";
import {
  generateAudioDto,
  generateAudioDtoType,
  getMessagesDto,
  getMessagesDtoType,
} from "./dto/tts-dto";
import { TtsService } from "./tts.service";

@Controller("tts")
export class TtsController {
  constructor(
    private readonly ttsService: TtsService,
    private readonly aiModelService: AiModelService
  ) {}

  @Post("file")
  @UseInterceptors(FileInterceptor("file"))
  async createTtsFromFile(
    @Body(new ZodValidationPipe(generateAudioDto))
    body: generateAudioDtoType,
    @UploadedFile()
    file: Express.Multer.File,
    @Res() res: Response,
    @CurrentUser() user: User
  ) {
    const { voice, language } = body;

    if (!file) {
      return res.status(400).json({ message: "File is required." });
    }
    const text = await textParser(file);

    if (!text) {
      return res
        .status(400)
        .json({ message: "Could not extract text from file." });
    }

    try {
      const data = await this.ttsService.postTts({
        text,
        voice,
        language,
        file,
        user,
      });

      //   const summary = await this.aiModelService.create(text);
      const summary = {
        text: "This is a summary of the text.",
        ai: true,
      };

      const messages = [
        {
          message_user_id: user.id,
          message_recording: "Creating a summary of the document...",
          message_recording_id: data.id,
          message_is_ai: false,
        },
        {
          message_user_id: user.id,
          message_recording: summary.text,
          message_recording_id: data.id,
          message_is_ai: true,
        },
      ];

      await this.ttsService.createMessage(messages);

      res.status(200).json({
        audio: data,
        summary,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Get("recordings")
  async getFileRecordings(@CurrentUser() user: User, @Res() res: Response) {
    try {
      const recordings = await this.ttsService.getRecordings(user);

      return res.status(200).json(recordings);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: (error as Error).message });
    }
  }

  @Get("messages")
  async getMessages(
    @CurrentUser() user: User,
    @Res() res: Response,
    @Query(new ZodValidationPipe(getMessagesDto))
    query: getMessagesDtoType
  ) {
    try {
      const messages = await this.ttsService.getMessages(user, query);

      return res.status(200).json(messages);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}
