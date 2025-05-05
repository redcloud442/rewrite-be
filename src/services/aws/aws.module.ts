import { PollyClient } from "@aws-sdk/client-polly";
import { S3 } from "@aws-sdk/client-s3";
import { Module } from "@nestjs/common";
import { AwsService } from "./aws.service";

@Module({
  providers: [
    AwsService,
    {
      provide: S3,
      useFactory: () => {
        return new S3({
          region: process.env.AWS_REGION || "ap-southeast-2",
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });
      },
    },
    {
      provide: PollyClient,
      useFactory: () => {
        return new PollyClient({
          region: process.env.AWS_REGION || "ap-southeast-2",
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });
      },
    },
  ],
  exports: [AwsService, S3, PollyClient],
})
export class AwsModule {}
