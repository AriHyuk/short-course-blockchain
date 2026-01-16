import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Izinkan Frontend akses Backend (CORS)
  app.enableCors(); 

  // 2. Ganti Port jadi 4000 (Biar gak bentrok sama Frontend)
  await app.listen(4000); 
}
bootstrap();