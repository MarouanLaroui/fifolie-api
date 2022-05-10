import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      preflightContinue: false,
    },
  });

  //Use validation pipe, verify if object matches DTO
  app.useGlobalPipes(new ValidationPipe());
  //app.useGlobalFilters(new HttpExceptionFilter());

  //Documentation config
  /*
  const config = new DocumentBuilder()
    .setTitle('PolyCloud documentation')
    .setDescription('PolyCloud API description')
    .setVersion('1.0')
    .addTag('polycloud')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  */
  await app.listen(process.env.APP_PORT || 3080);
}
bootstrap();
