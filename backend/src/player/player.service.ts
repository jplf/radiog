import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Player } from './player.interface';

import * as cp from 'child_process';

@Injectable()
export class PlayerService {
    
    constructor(private journal: Journal,
                private configService: ConfigService) {};
    
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
    
    play(file : string): void {
        
        var dir = this.configService.get<string>('MP3_DIR');
        var pathname = dir + '/' + file;
        this.run(pathname);
    }
    
    listen(uri : string): void {
        
        this.run(uri);
    }
    
    run(file : string): void {
        
        const mpg = cp.spawn('/usr/bin/mpg123', ['-q', file], {
            detached: true,
            stdio: ['ignore', 'ignore', 'pipe']
        });
        
        mpg.stderr.on('data', (data) => {
            this.journal.log(`stderr: ${data}`);
        });
        
        this.player.switchedOn = true;
    }

    switchOff(): void {
        this.player.switchedOn = false;
        
        const kill = cp.spawn('/bin/killall', ['-9', 'mpg123']);

        kill.stderr.on('data', (data) => {
            this.journal.log(`stderr: ${data}`);
        });
    }
}
