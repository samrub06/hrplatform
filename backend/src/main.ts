import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'], // Configuration simplifiée pour localhost
      queue: 'hr_platform',
      queueOptions: {
        durable: true,
      },
    },
  });

  try {
    await app.startAllMicroservices();
    console.log('RabbitMQ connecté avec succès sur le port 5672');
  } catch (error) {
    console.error('Erreur de connexion RabbitMQ:', error.message);
    process.exit(1); // Arrêter l'application si RabbitMQ n'est pas disponible
  }
  // Activer CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Remplacez par l'origine de votre client
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si vous avez besoin d'envoyer des cookies
  });

  app.useGlobalPipes(new ValidationPipe());
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
  const host = address.family === 'IPv6' ? 'localhost' : address.address; // Utiliser 'localhost' pour IPv6
  const fullUrl = `http://${host}:${port}`; // Construire l'URL
  console.log(`Application is running on: ${fullUrl}`); // Affiche
  console.log(`Swagger is available on: ${fullUrl}/swagger`); // Afficher l'URL de Swagger
}
bootstrap();
