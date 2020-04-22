import { Controller, Get, Headers } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Journal } from '../journal/journal.service';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
    
    constructor(private playerService: PlayerService,
                private journal: Journal,
                private configService: ConfigService) {};

    @Get()
    getStatus(@Headers('user-agent') agent:string) : string {
        
        var on : boolean;
        on = this.playerService.getStatus();
        if (on) {
            return "Player is playing !";
        }

        this.journal.log(agent);
        this.journal.log(this.configService.get<string>('AUTHOR'));
        this.journal.log(this.configService.get<string>('VERSION'));
        
        return JSON.stringify(this.playerService.getPlayer());
    }

    @Get('on')
    switchOn() : void {
        
        this.playerService.switchOn();
    }

    @Get('off')
    switchOff() : void {
        
        this.playerService.switchOff();
    }
    
}
