import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerController } from './player/player.controller';
import { PlayerService } from './player/player.service';
import { Journal } from './journal/journal.service';
import { StationsService } from './stations/stations.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.RADIOG_HOME + '/etc/radiog.conf'
        })
    ],
    controllers: [AppController, PlayerController],
    providers: [AppService, PlayerService, Journal, StationsService],
})

export class AppModule {}
