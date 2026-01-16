import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS for frontend
    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization',
    });
    
    // Global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      disableErrorMessages: false,
    }));
    
    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle('Movie Review API')
      .setDescription('API for managing movies and reviews')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    
    await app.listen(3000, '0.0.0.0');
    console.log('✓ Server is running on http://localhost:3000');
    console.log('✓ Swagger API docs: http://localhost:3000/api');
    console.log('✓ Ready to accept requests');
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
