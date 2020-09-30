import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Journal } from './journal/journal.service';
import { StationsService } from './stations/stations.service';

/**
 * curl http://localhost:18300/player|jq
 * curl http://localhost:18300/device/info| jq
 * curl http://localhost:18300/device/connect
 * curl http://localhost:18300/player/listen/10
 * curl http://localhost:18300/player/set?volume=30
 */
async function bootstrap() {
    
    const app = await NestFactory.create(AppModule, {
        logger: false
    });
    
    app.useLogger(app.get(Journal));

    // This service retrieves the list of known radios
    app.get(StationsService);
    let stationsService = app.get(StationsService);
    stationsService.load();
    
    let configService = app.get(ConfigService);
    let port = configService.get<number>('BACKEND_PORT');
    
    app.enableCors();
    await app.listen(port);
}

bootstrap();
