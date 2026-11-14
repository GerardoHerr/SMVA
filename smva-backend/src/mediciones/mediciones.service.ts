import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Medicion, MedicionDocument } from './schemas/medicion.schema.js';

import { CrearMedicionDto } from './dto/crear-medicion.dto.js';



@Injectable()
export class MedicionesService {
    constructor(
        @InjectModel(Medicion.name) private readonly medicionModel: Model<MedicionDocument>,
    ) {}

    //guardar datos recibidos mqtt
    async guardar (
        datos: CrearMedicionDto,
        timestampRecepcion: Date,
    ) {
        const medicion = new this.medicionModel({
            ...datos,
            timestampRecepcion,
        });
        return await medicion.save();
    }

    // Consultar 100 mediciones
    async ObtenerTodas() {
        return this.medicionModel
        .find()
        .sort({ timestampRecepcion: -1 })
        .limit(100)
        .lean()
        .exec();
    }

    // Consultar ultima medicion 
    async obtenerUltima(){
        return this.medicionModel
        .findOne()
        .sort({ timestampRecepcion: -1 })
        .lean()
        .exec();
    }

}
