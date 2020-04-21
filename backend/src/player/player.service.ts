import { Injectable } from '@nestjs/common';
import { Player } from './player.interface';

@Injectable()
export class PlayerService {
    
    private readonly player: Player = {
        command: 'mgp123',
        switchedOn: false
    };
    
    getStatus(): boolean {
        return this.player.switchedOn;
    }
}
