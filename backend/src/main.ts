import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import * as winston from 'winston';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  // Configuration simple de Winston
  const logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
      }),
    ],
  });

  const app = await NestFactory.create(AppModule);

  // Ajout du middleware session avant les autres middlewares
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60, // 1 heure
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  app.use(cookieParser());

  // Activer CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Remplacez par l'origine de votre clien
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si vous avez besoin d'envoyer des cookies
  });

  console.log('RABBITMQ_URL:', process.env.RABBITMQ_URL);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Hr Platform')
    .setDescription('The HR platform API documentation genrated by Swagger ')
    .setVersion('1.0')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  await app.listen(process.env.PORT ?? 3000);
  const port = process.env.PORT || 3000;
  const address = app.getHttpServer().address();
  const host = address.family === 'IPv6' ? 'localhost' : address.address;
  const fullUrl = `http://${host}:${port}`;

  logger.info(` 🚀 Application is running on: ${fullUrl}`);
  logger.info(` 📚 Swagger is available on: ${fullUrl}/swagger`);
}
bootstrap();
