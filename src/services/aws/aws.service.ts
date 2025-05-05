import { PollyClient } from "@aws-sdk/client-polly";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AwsService {
  constructor(
    private readonly s3: S3,
    private readonly polly: PollyClient
  ) {}

  async uploadBuffer(buffer: Buffer, key: string): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: "rewriteai",
        Key: key,
        Body: buffer,
        ContentType: "audio/mpeg",
      })
    );

    return `https://rewriteai.s3.ap-southeast-2.amazonaws.com/${key}`;
  }
}
