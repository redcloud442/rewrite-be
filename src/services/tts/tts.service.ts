import {
  LanguageCode,
  PollyClient,
  SynthesizeSpeechCommand,
  VoiceId,
} from "@aws-sdk/client-polly";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TtsService {
  private polly: PollyClient;

  constructor() {
    this.polly = new PollyClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  getTts(text: string): string {
    return "Hello World!";
  }

  // Updated to return Buffer instead of saving to file
  async postTts(params: {
    text: string;
    voice?: string;
    language?: string;
  }): Promise<Buffer> {
    try {
      const { voice, language, text } = params;

      const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: (voice as VoiceId) || "Joanna",
        LanguageCode: (language as LanguageCode) || "en-US",
      });

      const response = await this.polly.send(command);

      if (response.AudioStream) {
        const chunks: Uint8Array[] = [];
        const audioStream =
          response.AudioStream as unknown as NodeJS.ReadableStream;

        return new Promise<Buffer>((resolve, reject) => {
          audioStream.on("data", (chunk) => chunks.push(chunk));
          audioStream.on("end", () => resolve(Buffer.concat(chunks)));
          audioStream.on("error", reject);
        });
      } else {
        throw new Error("No AudioStream received from Polly.");
      }
    } catch (error) {
      console.error("Polly error:", error);
      throw new Error("Error synthesizing speech");
    }
  }
}
