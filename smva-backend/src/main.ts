import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const puerto = Number(process.env.PORT) || 3000;

  await app.listen(puerto, '127.0.0.1');

  console.log(
    `Servidor NestJS disponible en http://localhost:${puerto}`,
  );

}
await bootstrap();
