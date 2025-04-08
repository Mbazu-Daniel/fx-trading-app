import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ENVIRONMENT } from './common/config';
import { ExpressSetup, SwaggerSetup } from './common/app-config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
    abortOnError: false,
  });

  // setup express
  ExpressSetup(app);

  // setup swagger
  SwaggerSetup(app);

  await app.listen(ENVIRONMENT.APP.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
