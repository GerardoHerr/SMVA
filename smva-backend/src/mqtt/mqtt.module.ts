import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service.js';
import { MedicionesModule } from '../mediciones/mediciones.module.js';

@Module({
  imports: [MedicionesModule],
  providers: [MqttService]
})
export class MqttModule {}
