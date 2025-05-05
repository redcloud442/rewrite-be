import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exeption.filter";
import { LoggerMiddleware } from "./common/middlewares/logger.middleware";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });

  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix("api/v1");

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
