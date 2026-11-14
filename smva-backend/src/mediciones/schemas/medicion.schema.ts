import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'; 
import {HydratedDocument} from 'mongoose';

export type MedicionDocument = HydratedDocument<Medicion>;

@Schema({
    timestamps: true,
    collection: 'mediciones',
})

export class Medicion {
    @Prop({required: true})
    dispositivoId: string;

    @Prop({required: true})
    temperatura: number;

    @Prop({required: true})
    humedadAmbiental: number;

    @Prop({required: true})
    humedadSuelo: number;

    @Prop({required: true})
    luminosidad: number;

    @Prop({required: true})
    timestampRecepcion: Date;
}

export const MedicionSchema = SchemaFactory.createForClass(Medicion);

MedicionSchema.index({dispositivoId: 1, timestampRecepcion: -1});

