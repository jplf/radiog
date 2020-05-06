import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Journal } from '../journal/journal.service';
import { StationsService } from '../stations/stations.service';
import { PlayerService } from './player.service';

/**
 * The main component of the backend application
 * It routes the incoming requests to the player service
 * Usage : curl http://localhost:3000/player
 */

@Controller('player')
export class PlayerController {
    
    constructor(private playerService: PlayerService,
                private stationsService: StationsService,
                private journal: Journal,
                private configService: ConfigService) {
    };

    // Just gives back the status
    @Get()
    getStatus(@Headers('user-agent') agent:string) : string {
        
        return JSON.stringify(this.playerService.getPlayer());
    }

    // Gets the list of stations :  "/player/station-list | jq"
    @Get('station-list')
    stationList() : string {
        
        var list = this.stationsService.getList();
        return JSON.stringify(list);
    }

    // Gets a station info :  "/player/station?key=12 | jq"
    @Get('station')
    station(@Query('key') key: string) : string {
        
        var s = this.stationsService.get(key);
        return JSON.stringify(s);
    }

    // Sets the volume between 0 an 100 %:  "/player/set?volume=12" 
    @Get('set')
    set(@Query('volume') volume: string) : void {
        
        var s = this.playerService.setVolume(volume);
        this.journal.log('Volume set to ' + volume);
    }
    
    // Plays a file with white spaces encoded :
    // curl -G --data-urlencode "file=68/Miles Davis-Summertime.mp3"
    //         localhost:3000/player/play
    // Plays another one : "/player/play?file=78/Debademba-Agakamina.mp3"
    
    @Get('play')
    play(@Query('file') file: string) : void {
        
        this.journal.log('Playing ' + file);
        this.playerService.play(file);
    }

    // Listens a radio : "/player/listen/13"
    @Get('listen/:key')
    listen(@Param() params) : void {
        
        var s = this.stationsService.get(params.key);
        this.journal.log('Listening to ' + s.name);
        this.playerService.listen(s.stream);
    }

    // Stops playing
    @Get('off')
    switchOff() : void {
        this.playerService.switchOff();
        this.journal.log('Stop playing');
    }
    
}
