import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Journal } from './journal/journal.service';
import { StationsService } from './stations/stations.service';

/**
 * curl http://localhost:3000/player|jq
 * curl http://localhost:3000/device/info| jq
 * curl http://localhost:3000/device/connect
 * curl http://localhost:3000/player/listen/10
 * curl http://localhost:3000/player/set?volume=30
 */
async function bootstrap() {

    const app = await NestFactory.create(AppModule, {
        logger: false
    });

    app.useLogger(app.get(Journal));

    // This service retrieves the list of known radios
    app.get(StationsService);
    const stationsService = app.get(StationsService);
    stationsService.load();

    const configService = app.get(ConfigService);
    const port = configService.get<number>('BACKEND_PORT');

    app.enableCors();
    await app.listen(port);
}

bootstrap();
