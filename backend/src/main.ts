import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Journal } from './journal/journal.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false
    });
    
    app.useLogger(app.get(Journal));
    
    await app.listen(3000);
}

bootstrap();
