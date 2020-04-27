import { Controller, Get, Headers, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Journal } from '../journal/journal.service';
import { PlayerService } from './player.service';
import { StationsService } from '../stations/stations.service';

@Controller('player')
export class PlayerController {
    
    constructor(private playerService: PlayerService,
                private stationsService: StationsService,
                private journal: Journal,
                private configService: ConfigService) {
    };

    @Get()
    getStatus(@Headers('user-agent') agent:string) : string {
        
        var on : boolean;
        on = this.playerService.getStatus();
        if (on) {
            return "Player is playing !";
        }

        this.journal.log(this.configService.get<string>('VERSION'));
        
        return JSON.stringify(this.playerService.getPlayer());
    }

    @Get('station')
    station(@Query('key') key: string) : string {
        
        var s = this.stationsService.get(key);
        return JSON.stringify(s);
    }

    @Get('play')
    play(@Query('file') file: string) : void {
        
        this.playerService.play(file);
    }

    @Get('listen/:uri')
    listen(@Param() params) : void {
        
        this.journal.log(params.uri);
       // this.playerService.listen(uri);
    }

    @Get('off')
    switchOff() : void {
        this.playerService.switchOff();
    }
}
