/**
 * The main component of the backend application
 * It routes the incoming requests to the player service
 * Usage : curl http://localhost:3000/player
 */
import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { Journal } from '../journal/journal.service';
import { StationsService } from '../stations/stations.service';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {

    constructor(private playerService: PlayerService,
                private stationsService: StationsService,
                private journal: Journal) {
    };

    // Just gives back the status
    @Get()
    @ApiResponse({ description: 'The status of the player.'})
    getStatus(@Headers('user-agent') agent: string) : string {

        return JSON.stringify(this.playerService.getPlayer());
    }

    // Gets the list of stations :  "/player/station-list | jq"
    @Get('station-list')
    @ApiOkResponse({description: 'The list of known stations.'})
    stationList() : string {

        this.journal.log('Checking list stations');
        const list = this.stationsService.getList();
        return JSON.stringify(list);
    }

    // Gets a station info :  "/player/station?key=12 | jq"

    @Get('station')
    station(@Query('key')
            key: string): string {

                this.journal.log('Checking station ' + key);

                const s = this.stationsService.get(key);
                return JSON.stringify(s);
            }

    // Sets the volume between 0 an 100 %:  "/player/set?volume=12"
    @Get('set')
    set(@Query('volume') volume: string): string {

        let value: number = parseInt(volume, 10);

        if (isNaN(value)) {
            this.journal.log('Invalid volume value : ' + volume);
            return;
        }

        this.playerService.setVolume(value);
        this.journal.log('Volume set to ' + volume + '%');
        return JSON.stringify(volume);
    }

    // Restarts playing
    @Get('on')
    switchOn(): string {
        this.playerService.switchOn();
        this.journal.log('Restart playing');
        return JSON.stringify('restarted');
   }

    // Stops playing
    @Get('off')
    switchOff(): string {
        this.playerService.switchOff();
        this.journal.log('Stop playing');
        return JSON.stringify('off');
    }

    /**
     * Plays a file with white spaces encoded :
     * cd /ker/packages/xperia/Mp3
     * curl -G --data-urlencode "file=68/Miles Davis-Summertime.mp3"
     *         localhost:3000/player/play
     * Plays another one : "/player/play?file=78/Debademba-Agakamina.mp3"
     */
    @Get('play')
    play(@Query('file') file: string): string {

        this.journal.log('Playing ' + file);
        this.playerService.play(file);
        return JSON.stringify(file);
    }

    // Listens a radio : "/player/listen/13"
    @Get('listen/:key')
    listen(@Param() params): string {

        const s = this.stationsService.get(params.key);
        this.journal.log('Listening to ' + s.name);
        this.playerService.listen(s.stream);
        return JSON.stringify(s.name + ' on');
    }
}
/*------------------------------------------------------------------------*/
