import { Controller, Get, Headers } from '@nestjs/common';
import { Request } from 'express';
import { Journal } from '../journal/journal.service';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
    
    constructor(private playerService: PlayerService,
                private journal: Journal) {};

    @Get()
    getStatus(@Headers('user-agent') agent:string) : string {
        
        var on : boolean;
        on = this.playerService.getStatus();
        if (on) {
            return "Player is playing !";
        }

        this.journal.log(agent);
        //     this.journal.log(JSON.stringify(request.headers, null, 4));
        
        return "Player is switched off !";
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
