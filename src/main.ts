import { config } from 'dotenv';
config();

import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { AuthGuard } from './api/auth/auth.guard';
import * as cors from 'cors';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalGuards();
  const config = new DocumentBuilder()
    .setTitle('Personal Sys API')
    .setDescription(
      'The Personal Sys API is a RESTful web service that provides a simple way for personal trainers to manage their client workout sheets. With this API, personal trainers can create, read, update, and delete workout sheets for their clients. Clients can also view their workout sheets and track their progress over time.',
    ) // TODO create a description
    .setVersion('1.0')
    .addTag('tag')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // Name of the security scheme, you can choose any name
    )
    .build();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      // origin: '*',
    }),
  );

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0', () => {
    console.log(`App BRUNOOOOOOOOOO listening on port .env: ${process.env.PORT} / port: ${port}`);
  });
}
bootstrap();
