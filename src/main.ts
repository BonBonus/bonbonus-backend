import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    },
  });

  const configService = app.get(ConfigService);
  const environment = configService.get<string>('ENVIRONMENT');
  const version = '0.0.1';

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.use(helmet());
  app.use(cookieParser());

  if (['local-dev', 'development'].includes(environment)) {
    const options = new DocumentBuilder()
      .setTitle('BonBonus – backend service')
      .setDescription('Description of API methods.')
      .addBearerAuth()
      .setVersion(version)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
    Logger.log('Swagger has been launched', 'Swagger');
  }

  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
