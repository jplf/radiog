/**
 * The module manager
 */
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
import { DeviceService } from './device/device.service';
import { OutputService } from './output/output.service';
import { OutputController } from './output/output.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [process.env.RADIOG_CONF,
                          process.env.RADIOG_HOME
                          + '/etc/radiog.conf']
        })
    ],
    controllers: [PlayerController, OutputController],
    providers: [StationsService, Journal, PlayerService, DeviceService,
                OutputService]
})

export class AppModule {}

/*------------------------------------------------------------------------*/
