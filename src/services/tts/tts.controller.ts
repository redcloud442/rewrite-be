import { User } from "@clerk/backend";
import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ZodValidationPipe } from "src/common/pipe/zod.validationPipe";
import { CurrentUser } from "src/decorators/auth.decorator";
import { textParser } from "src/functions/function";
import { AiModelService } from "../ai-model/ai-model.service";
import { SupabaseService } from "../supabase/supabase.service";
import { generateAudioDto, generateAudioDtoType } from "./dto/tts-dto";
import { TtsService } from "./tts.service";

@Controller("tts")
export class TtsController {
  constructor(
    private readonly ttsService: TtsService,
    private readonly aiModelService: AiModelService,
    private readonly supabase: SupabaseService
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
      const audioBuffer = await this.ttsService.postTts({
        text,
        voice,
        language,
      });

      //   const summary = await this.aiModelService.create(text);
      const summary = {
        text: "This is a summary of the text.",
        ai: true,
      };

      const audioBase64 = audioBuffer.toString("base64");

      const { error } = await this.supabase.supabase.storage
        .from("AUDIO_FILES")
        .upload(`${user.id}-${Date.now()}.mp3`, audioBuffer);

      if (error) {
        throw new Error(error.message);
      }

      res.status(200).json({
        audio: audioBase64,
        summary,
      });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}
