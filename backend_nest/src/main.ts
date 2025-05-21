import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ENVS } from './helpers/string-const';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  // Enable validation pipe
  app.useGlobalPipes(new ValidationPipe({ 
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  
  // Apply global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Cookie parser
  app.use(cookieParser());
  
  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  console.log(`SERVER PORT: ${process.env[ENVS.PORT]}`);
  await app.listen(process.env[ENVS.PORT] ?? 3500);
}
bootstrap();
