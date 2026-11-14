import { Module } from '@nestjs/common';
import { MedicionesService } from './mediciones.service.js';
import { MedicionesController } from './mediciones.controller.js';
import { MongooseModule } from '@nestjs/mongoose';

import { Medicion, MedicionSchema } from './schemas/medicion.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Medicion.name, schema: MedicionSchema }]),
  ],
  providers: [MedicionesService],
  controllers: [MedicionesController],
  exports: [MedicionesService],
})

export class MedicionesModule {}
