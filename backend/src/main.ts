import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Journal } from './journal/journal.service';
import { StationsService } from './stations/stations.service';

async function bootstrap() {
    
    const app = await NestFactory.create(AppModule, {
        logger: false
    });
    
    app.useLogger(app.get(Journal));
    
    await app.get(StationsService);
    let stationsService = await app.get(StationsService);
    await stationsService.load();
    
    await app.listen(3000);
}

bootstrap();
