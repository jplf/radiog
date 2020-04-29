import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Journal } from './journal/journal.service';
import { StationsService } from './stations/stations.service';

async function bootstrap() {
    
    const app = await NestFactory.create(AppModule, {
        logger: false
    });
    
    app.useLogger(app.get(Journal));

    // This service retrieves the list of known radios
    await app.get(StationsService);
    let stationsService = await app.get(StationsService);
    await stationsService.load();
    
    let configService = await app.get(ConfigService);
    let port = configService.get<number>('BACKEND_PORT');
    
    await app.listen(port);
}

bootstrap();
