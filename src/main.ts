import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv-flow';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Personal Sys API')
    .setDescription(
      'The Personal Sys API is a RESTful web service that provides a simple way for personal trainers to manage their client workout sheets. With this API, personal trainers can create, read, update, and delete workout sheets for their clients. Clients can also view their workout sheets and track their progress over time.',
    ) // TODO create a description
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
