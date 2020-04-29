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

    // The current player
    private readonly player: Player = {
        command: 'mgp123',
        switchedOn: false
    };

    // Returns the current player
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
    run(file : string): void {

        // Make sure to stop a possible running player
        this.switchOff();

        // Launches the player
        const mpg = cp.spawn('/usr/bin/mpg123', ['-q', file], {
            detached: true,
            stdio: ['ignore', 'ignore', 'pipe']
        });
        
        mpg.stderr.on('data', (data) => {
            this.journal.log(`stderr: ${data}`);
        });
        
        this.player.switchedOn = true;
    }

    // No mercy for any existing player kill'em all
    switchOff(): void {
        this.player.switchedOn = false;
        
        const kill = cp.spawn('/bin/killall', ['-9', 'mpg123']);

        kill.stderr.on('data', (data) => {
            this.journal.log(`stderr: ${data}`);
        });
    }
}
