import { Injectable } from '@nestjs/common';
import { Player } from './player.interface';

@Injectable()
export class PlayerService {
    
    private readonly player: Player = {
        command: 'mgp123',
        switchedOn: false
    };
    
    getPlayer(): Player {
        return this.player;
    }
    
    getStatus(): boolean {
        return this.player.switchedOn;
    }
    
    switchOn(): void {
        this.player.switchedOn = true;
    }

    switchOff(): void {
        this.player.switchedOn = false;
    }
}
