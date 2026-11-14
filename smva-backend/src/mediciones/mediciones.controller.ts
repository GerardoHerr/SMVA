import { Controller, Get } from '@nestjs/common';
import {MedicionesService} from './mediciones.service.js';


@Controller('mediciones')
export class MedicionesController {
    constructor(private readonly medicionesService: MedicionesService) {}

    @Get()
    obtenerTodas() {
        return this.medicionesService.ObtenerTodas();
    }

    @Get('ultima')
    obtenerUltima() {
        return this.medicionesService.obtenerUltima();
    }
    
}
