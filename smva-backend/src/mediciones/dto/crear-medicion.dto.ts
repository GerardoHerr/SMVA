
import {
  IsNumber,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CrearMedicionDto {
    @IsString()
    @IsNotEmpty()
    dispositivoId: string;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    temperatura: number;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    humedadAmbiental: number;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    humedadSuelo: number;

    @IsNumber({ allowNaN: false, allowInfinity: false })
    luminosidad: number;

}

