import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Player } from './player.interface';

import * as cp from 'child_process';
const fs = require('fs').promises;

// Manages the commands of the player
@Injectable()
export class PlayerService {
    
    constructor(private journal: Journal,
                private configService: ConfigService) {};

    // The current player status
    private readonly player: Player = {
        command: this.configService.get<string>('COMMAND'),
        version: this.configService.get<string>('VERSION'),
        source: this.configService.get<string>('SOURCE'),
        volume: this.configService.get<number>('VOLUME'),
        switchedOn: false
    };

    // Returns the current player : curl localhost:18300/player|jq
    getPlayer(): Player {
        return this.player;
    }

    // Finds out whether the player is running or not.
    getStatus(): boolean {
        return this.player.switchedOn;
    }

    // Plays a mp3 file found in the local file system
    // The path must be given from the mp3 directory MP3_DIR
    play(file : string): void {
        
        var dir = this.configService.get<string>('MP3_DIR');
        var pathname = dir + '/' + file;
        
        Promise.resolve(pathname)
            .then(pathname => {
                 return fs.stat(pathname);
            })
            .then(stat => {
                this.journal.log("File found : " + pathname);
                this.run(pathname)
            })
            .catch(() => {
                this.journal.log("File " + pathname + " not found");
                return;
            });
     }

    // Connects to a station and plays the stream
    listen(stream : string): void {
        this.run(stream);
    }

    // Plays either a file or a stream.
    private run(file : string): void {

        // Launches the player script which kill a possibly existing player
        const mpg = cp.spawn(this.player.command, [file], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });
        
        this.player.source = file;
        this.player.switchedOn = true;
    }

    // Restarts what was playing
    switchOn(): void {
        this.run(this.player.source);
    }

    // No mercy for any existing player kill'em all
    switchOff(): void {
        
        this.player.switchedOn = false;
        
        // Make sure the path to killall is correct
        const kill = cp.spawn('/bin/killall', ['-9', 'mpg123'], {
            stdio: ['ignore', 'ignore', 'ignore']
        });
    }

    // Changes the output volume
    setVolume(volume: string): void {

        var value : number = parseInt(volume, 10);
        
        if (isNaN(value)) {
            this.journal.log('Invalid volume value : ' + volume);
            return;
        }
        else if (value < 0) {
            value = 0;
        }
        else if (value > 100) {
            value = 100;
        }
        
        this.player.volume = value;
            
        var percent : string = value.toString() + '%';
        
        const kill = cp.spawn('/usr/bin/amixer',
                              ['-D', 'pulse', 'sset', 'Master', percent]);

        kill.stderr.on('data', (data) => {
            this.journal.log(`stderr: ${data}`);
        });

    }
}
