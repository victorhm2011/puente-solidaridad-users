import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipUndefinedProperties: true,
      skipNullProperties: true,
      skipMissingProperties: true,
      transform: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  app.enableCors();
  console.log(process.env.PORT);
  await app.listen(process.env.PORT, '0.0.0.0');
  
}
bootstrap();
