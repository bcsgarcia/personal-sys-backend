import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

config();
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards();

  const corsOptions = {
    origin: process.env.NODE_ENV === 'dev' ? '*' : 'https://treinadoraamanda.bcsgarcia.com.br',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  };

  app.enableCors(corsOptions);

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

  app.use(bodyParser.json({ limit: '500mb' }));
  app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

  // const prodUrl = 'https://treinadoraamanda.bcsgarcia.com.br';

  // const corsOrigin = process.env.NODE_ENV === 'dev' ? '*' : process.env.CORS_ORIGIN || prodUrl;

  // app.use(
  //   cors({
  //     origin: corsOrigin,
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //     allowedHeaders: 'Content-Type, Accept, Authorization',
  //     credentials: true,
  //   }),
  // );

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0', () => {
    console.log(`App listening on port .env: ${process.env.PORT} / port: ${port}`);
  });
}

bootstrap();
