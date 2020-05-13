import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Manages the log files
import { Journal } from './journal/journal.service';
// Manages the list of radio stations
import { StationsService } from './stations/stations.service';
// Controls the radio player
import { PlayerController } from './player/player.controller';
// Handles the player commands
import { PlayerService } from './player/player.service';
import { DeviceController } from './device/device.controller';
import { DeviceService } from './device/device.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: process.env.RADIOG_CONF
        })
    ],
    controllers: [PlayerController, DeviceController],
    providers: [StationsService, Journal, PlayerService, DeviceService],
})

export class AppModule {}
