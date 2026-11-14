import  {
    Injectable,
    Logger,
    OnModuleInit,
    OnModuleDestroy,
} from '@nestjs/common';

import {ConfigService} from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { MedicionesService } from '../mediciones/mediciones.service.js';
import { CrearMedicionDto } from '../mediciones/dto/crear-medicion.dto.js';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(MqttService.name);
    private client?: MqttClient;

    constructor(
        private readonly configService: ConfigService,
        private readonly medicionesService: MedicionesService,
    ) {}

    onModuleInit() {
        const brokerUrl = this.configService.getOrThrow<string>(
        'MQTT_BROKER_URL',
        );

        const topic = this.configService.getOrThrow<string>('MQTT_TOPIC');

        // conectar al broker
        this.client = connect(brokerUrl, {
            clientId: 'smva-backend',
            reconnectPeriod: 1000, // reintentar cada segundo
        });

        // Suscribirse cuando se establece la conexion
        this.client.on('connect', () => {
            this.logger.log(`Conectado al broker MQTT`);

            this.client?.subscribe(
                topic,
                { qos: 0},
                (error) => {
                    if (error) {
                        this.logger.error(
                            `Error al suscribirse al topic ${topic}: ${error.message}`,
                        );
                    } else {
                        this.logger.log(`Suscrito al topic ${topic}`);
                    }
                },
            );
        });

        //Procesar los mensajes entrantes
        this.client.on('message', (topicoRecibido, buffer) => {
            const timestampRecepcion = new Date();

            void this.procesarMensaje(topicoRecibido, buffer, timestampRecepcion);
        });
    
        this.client.on('error', (error) => {
            this.logger.error(
                `Error MQTT: ${error.message}`,
            );
        });

        this.client.on('offline', () => {
            this.logger.warn(
                'Broker MQTT desconectado',
            );
        });
    }

    private async procesarMensaje(
        topic: string,
        buffer: Buffer,
        timestampRecepcion: Date,
    ) {
        try {
            const contenido: unknown = JSON.parse(
                buffer.toString('utf8'),
            );

            if (
                typeof contenido !== 'object' ||
                contenido === null ||
                Array.isArray(contenido)
            ) {
                throw new Error('El contenido del mensaje no es un objeto JSON válido');
            }

            //convertir a DTO
            const datos = plainToInstance(CrearMedicionDto, contenido, {
                excludeExtraneousValues: false,
            });

            //validar el DTO
            const errores = await validate(datos, {
                whitelist: true,
                forbidNonWhitelisted: true,
            });

            if (errores.length > 0) {
                throw new Error('Datos de sensores invalidos');
            }

            //guardar en la base de datos
            const medicion =
                await this.medicionesService.guardar(
                    datos,
                    timestampRecepcion,
                );

            this.logger.log(
                `Medicion almacenada: ${medicion.id}`,
            );
        } catch (error) {
            this.logger.error(
                `Error al procesar mensaje de ${topic}: ${
                error instanceof Error
                    ? error.message
                    : String(error)
                }`,
            );
        }
    }

    onModuleDestroy() {
        this.client?.end();
    }

}
