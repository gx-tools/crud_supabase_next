import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ENVS } from './helpers/string-const';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getCorsOrigin } from './helpers/cors-config';

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
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('RESTful API for managing tasks and projects with authentication')
    .setVersion('1.0')
    .addTag('Authentication', 'Endpoints for user authentication and authorization')
    .addTag('Tasks', 'Endpoints for managing user tasks')
    .addTag('Projects', 'Endpoints for managing user projects')
    .addTag('Users', 'Endpoints for managing user profile')
    .setContact('Developer Team', 'https://example.com', 'dev@example.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth()
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token'
    })
    .build();
    
  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
    operationIdFactory: (
      controllerKey: string,
      methodKey: string
    ) => methodKey
  });
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
    },
    customSiteTitle: 'Task Management API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
  });
  
  // CORS
  app.enableCors({
    origin: getCorsOrigin(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  console.log(`SERVER PORT: ${process.env[ENVS.PORT]}`);
  await app.listen(process.env[ENVS.PORT] ?? 3500);
}
bootstrap();
