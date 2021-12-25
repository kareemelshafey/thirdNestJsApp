import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // used to make user only add to the fields they are allowed to add to, so it is a security thing :D 
      whitelist: true
    })
  )
  await app.listen(3000);
}
bootstrap();
