import { Controller, Get } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
    
    constructor(private playerService: PlayerService) {};

    @Get()
    getStatus() : string {
        
        var on : boolean;
        on = this.playerService.getStatus();
        if (on) {
            return "Player is playing !";
        }
        
        return "Player is switched off !";
    }
}
