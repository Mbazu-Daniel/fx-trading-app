import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerSetup(app: any) {
  const config = new DocumentBuilder()
    .setTitle('FX Trading Studio')
    .setDescription('FX Trading Studio API Documentation')
    .setVersion('1.0')
    .addTag('Auth', 'Collection of auth endpoints')
    .addTag('Users', 'Collection of user related endpoints')
    .addBearerAuth()
    .build();

  const document = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
