import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { MedicionesModule } from './mediciones/mediciones.module.js';
import { MqttModule } from './mqtt/mqtt.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {MongooseModule} from "@nestjs/mongoose";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'smva-backend',
    }),
    MedicionesModule,
    MqttModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>(
          'MONGO_URI',
        ),
      }),
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
