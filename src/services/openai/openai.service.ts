import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import OpenAIApi from "openai";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources";

type Message = {
  text: string;
  ai?: boolean;
};

@Injectable()
export class OpenaiService {
  public openai: OpenAIApi;
  constructor() {
    this.openai = new OpenAIApi({
      apiKey: process.env.OPEN_AI_SECRET_KEY,
    });
  }

  /**
   * Make a request to ChatGPT to generate a response based on a prompt and message history.
   * @param prompt - The prompt for the ChatGPT model
   * @param messages - An array of messages representing the conversation history
   * @returns A string containing the generated response
   */
  async chatGptRequest(prompt: string, messages: Message[]): Promise<string> {
    try {
      // Convert message history to the format expected by the OpenAI API
      const history = messages.map(
        (message): ChatCompletionMessageParam => ({
          role: message.ai ? "assistant" : "user",
          content: message.text,
        })
      );

      // Make a request to the ChatGPT model
      const completion: ChatCompletion =
        await this.openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: prompt,
            },
            ...history,
          ],
          temperature: 0.5,
          max_tokens: 1000,
        });

      // Extract the content from the response
      const [content] = completion.choices.map(
        (choice) => choice.message.content
      );

      if (!content) {
        throw new ServiceUnavailableException("Failed request to ChatGPT");
      }

      return content;
    } catch (e) {
      // Log and propagate the error
      console.error(e);
      throw new ServiceUnavailableException("Failed request to ChatGPT");
    }
  }

  /**
   * Synthesize speech from text using the OpenAI text-to-speech model.
   * @param userId - The user ID for identifying the audio file
   * @param text - The text to be synthesized
   * @returns A URL pointing to the synthesized audio file
   */
  //   async synthesizeSpeech(userId: number, text: string): Promise<string> {
  //     try {
  //       // Make a request to the text-to-speech model
  //       const [arrayBuffer] = await Promise.all([
  //         this.openai.audio.speech.create({
  //           input: text,
  //           model: "tts-1-hd",
  //           voice: "alloy",
  //         }),
  //       ]);

  //       // Convert the audio data to a buffer
  //       const audioBuffer = Buffer.from(arrayBuffer);

  //     } catch (e) {
  //       // Log and propagate the error
  //       console.error(e);
  //       throw new ServiceUnavailableException("Failed to synthesize speech");
  //     }
  //   }

  /**
   * Transcribe audio from a buffer using the OpenAI Whisper model.
   * @param audioBuffer - The buffer containing audio data
   * @param language - The language of the audio
   * @returns The transcribed text
   */
  async transcribeAudio(
    audioBuffer: Buffer,
    language: string
  ): Promise<string> {
    // Convert the audio buffer to a file object
    const blob = new Blob([audioBuffer], {
      type: "audio/wav",
    });
    const file = new File([blob], "input.wav", { type: "audio/wav" });

    try {
      // Make a request to the Whisper model for audio transcription
      const whisperResponse = await this.openai.audio.transcriptions.create({
        model: "whisper-1",
        language,
        file,
        response_format: "json",
      });

      // Return the transcribed text
      return whisperResponse.text;
    } catch (e) {
      // Log and propagate the error
      console.error(e);
      throw new ServiceUnavailableException("Failed to transcribe audio");
    }
  }

  /**
   * Generate a response to an image-related prompt using the ChatGPT Vision model.
   * @param text - The text prompt
   * @param url - The URL of the image
   * @returns A string containing the generated response
   */
  //   async chatGptVision(text: string, url: string): Promise<string> {
  //     try {
  //       // Make a request to the ChatGPT Vision model
  //       const completion = await this.openai.chat.completions.create({
  //         model: "gpt-4-vision-preview",
  //         messages: [
  //           {
  //             role: "user",
  //             content: [
  //               { type: "text", text },
  //               { type: "image_url", image_url: { url, detail: "high" } },
  //             ],
  //           },
  //         ],
  //         temperature: 0.5,
  //         max_tokens: 1000,
  //       });

  //       // Extract the content from the response
  //       const [content] = completion.choices.map(
  //         (choice) => choice.message.content
  //       );

  //       return content;
  //     } catch (e) {
  //       // Log and propagate the error
  //       console.error(e);
  //       throw new ServiceUnavailableException("Unable to recognize image");
  //     }
  //   }

  /**
   * Generate an image based on a text prompt using the OpenAI DALL-E model.
   * @param text - The text prompt for image generation
   * @returns A URL pointing to the generated image
   */
  //   async generateImage(text: string): Promise<string> {
  //     try {
  //       // Make a request to the DALL-E model for image generation
  //       const { data } = await this.openai.images.generate({
  //         model: "dall-e-3",
  //         prompt: text,
  //         response_format: "url",
  //       });

  //       // Return the URL of the generated image
  //       return data[0].url;
  //     } catch (e) {
  //       // Log and propagate the error
  //       console.error(e);
  //       throw new ServiceUnavailableException("Failed to generate image");
  //     }
  //   }
}
