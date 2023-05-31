import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv-flow';
import * as bodyParser from 'body-parser';
import { AuthGuard } from './api/auth/auth.guard';
import * as cors from 'cors';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards();
  const config = new DocumentBuilder()
    .setTitle('Personal Sys API')
    .setDescription(
      'The Personal Sys API is a RESTful web service that provides a simple way for personal trainers to manage their client workout sheets. With this API, personal trainers can create, read, update, and delete workout sheets for their clients. Clients can also view their workout sheets and track their progress over time.',
    ) // TODO create a description
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // Name of the security scheme, you can choose any name
    )
    .build();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(
    cors({
      origin: 'http://localhost:50249',
      // origin: '*',
    }),
  );

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(process.env.SYSTEM_PORT || 8080);
}
bootstrap();
