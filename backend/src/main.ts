/**
 * The main function.
 *
 * Usage: npm run start
 * It loads the configuration then starts the http server.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Journal } from './journal/journal.service';
import { StationsService } from './stations/stations.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as fs from 'fs';

/**
 * curl -k http://localhost:3000/player|jq
 * curl -k http://localhost:3000/device/info| jq
 * curl -k http://localhost:3000/device/connect
 * curl -k http://localhost:3000/player/listen/10
 * curl -k http://localhost:3000/player/set?volume=30
 */
async function bootstrap() {

    // Something like /home/lefevre/work/hub/radiog/etc/madeux
    const certPath = process.env.RADIOG_HOME + '/etc/' + process.env.HOSTNAME;
          
    const httpsOptions = {
        key: fs.readFileSync(certPath + '.key.pem'),
        cert: fs.readFileSync(certPath + '.cert.pem'),
    };
    
    const app = await NestFactory.create(AppModule, {
        httpsOptions,
        bufferLogs: true
    });

    const config = new DocumentBuilder()
          .setTitle('RadioG backend')
          .setDescription('The RadioG backend API description')
          .addTag('radiog')
          .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    console.log('Starting !');
    const journal = app.get(Journal);

    app.useLogger(journal);

    journal.log('Application is about to start');
    journal.log('Certificates are like ' + certPath);

    // This service retrieves the list of known radios
    // app.get(StationsService);
    const stationsService = app.get(StationsService);
    stationsService.load();

    const configService = app.get(ConfigService);
    const port = configService.get<number>('BACKEND_PORT');
    journal.log('RadioG is listening on port ' + port);

    app.enableCors();
    await app.listen(port);
}

bootstrap();

/*------------------------------------------------------------------------*/
