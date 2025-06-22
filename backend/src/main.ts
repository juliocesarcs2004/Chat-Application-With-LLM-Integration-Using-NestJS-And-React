import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const clientUrl = configService.get<string>('CLIENT_URL');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  app.enableCors({
    // In production, only allow your frontend's origin.
    // In development, allow any origin (true) for convenience.
    origin: isProduction ? clientUrl : true,
    methods: 'GET,POST',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away properties that are not in the DTO.
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are sent.
      transform: true, // Transforms the payload to an instance of the DTO.
    }),
  );

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();