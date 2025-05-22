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
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const corsOrigin = isDevelopment 
    ? ['http://localhost:3000', 'http://127.0.0.1:3000'] // Add your frontend dev URLs
    : process.env.FRONTEND_URL; // Add this to your .env for production

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  console.log(`SERVER PORT: ${process.env[ENVS.PORT]}`);
  await app.listen(process.env[ENVS.PORT] ?? 3500);
}
bootstrap();
