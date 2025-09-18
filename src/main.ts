import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { BaseExceptionFilter, ResponseInterceptor } from 'lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // API Prefix
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Validator Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Register interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Register filters - order matters, lower one runs first!
  app.useGlobalFilters(
    new BaseExceptionFilter(), // Then handle everything else
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API Boilerplate')
    .setDescription('The boilerplate for NestJS projects')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalResponse({
      status: '4XX',
      description: 'Bad request',
    })
    .addGlobalResponse({
      status: '5XX',
      description: 'Internal Server Error',
    })
    .build();

  // Create the document
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = process.env.PORT ?? 4000;
  await app.listen(port).then(() => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
