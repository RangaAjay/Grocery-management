import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Grocery Management')
    .setDescription('Nestjs app for Grocery Management')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      name: 'Bearer Token',
      description: 'Access Token for app',
      'x-tokenName': 'Bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
