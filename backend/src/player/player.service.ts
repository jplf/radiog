/**
 * Managing the sound player.
 * To check only this service run :
 * npm test -- --silent=false player/player.service.spec.ts
 * To check only one method change it() to it.only()
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Player } from './player.interface';

import * as cp from 'child_process';
const fs = require('fs').promises;

/**
 * Manages the commands of the player.
 */
@Injectable()
export class PlayerService {

    constructor(private journal: Journal,
                private configService: ConfigService) {
        
        this.setVolume(this.configService.get<number>('VOLUME'));
    };

    // The current player status
    private readonly player: Player = {
        command: this.configService.get<string>('COMMAND'),
        version: this.configService.get<string>('VERSION'),
        source: this.configService.get<string>('SOURCE'),
        volume: this.configService.get<number>('VOLUME'),
        switchedOn: false
    };

    /**
     * Returns the current player e.g. : curl localhost:3000/player|jq
     * @return the player object.
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * Finds out whether the player is running or not.
     * @return true if it is actually playing.
     */
    getStatus(): boolean {
        return this.player.switchedOn;
    }

    /**
     * Plays a mp3 file found in the local file system.
     * The path must be given from the mp3 directory MP3_DIR.
     * Actually very seldom used.
     * @param file the path to the file to play.
     */
    play(file: string): void {

        const dir = this.configService.get<string>('MP3_DIR');
        if (! dir) {
            this.journal.log("MP3_DIR undefined");
            return;
        }
        
        const pathname = dir + '/' + file;

        Promise.resolve(pathname)
            .then(pathname => {
                 return fs.stat(pathname);
            })
            .then(() => {
                this.journal.log("File found : " + pathname);
                this.run(pathname)
            })
            .catch(() => {
                this.journal.log("File " + pathname + " not found");
                return;
            });
     }

    /**
     * Connects to a station and plays the stream.
     * @param stream the stream to play.
     */
    listen(stream: string): void {
        this.run(stream);
    }

    /**
     * Plays either a file or a stream.
     * @param file the source to play.
     */
    private run(file: string): void {

        this.journal.log("Playing file " + file
                         + " at volume " + this.player.volume);

        // Launches the player script which kill a possibly existing player
        cp.spawn(this.player.command, [file], {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore']
        });

        this.player.source = file;
        this.player.switchedOn = true;
    }

    /**
     *  Restarts what was playing.
     */
    switchOn(): void {
        this.run(this.player.source);
    }

    /**
     * No mercy for any existing player : kill'em all !
     * It is assumed that the player command is based on mpg123.
     * But this must be verified :(
     */
    switchOff(): void {

        this.player.switchedOn = false;

        // Make sure the path to killall is correct
        cp.spawn('/bin/killall', ['-9', 'mpg123'], {
            stdio: ['ignore', 'ignore', 'ignore']
        });
    }

    /**
     * Changes the output volume.
     * Based on amixer(1).
     * @param the value to set between 0 and 100.
     */
    setVolume(value: number): void {

        if (value < 0) {
            value = 0;
        }
        else if (value > 100) {
            value = 100;
        }

        this.player.volume = value;

        const percent: string = value.toString() + '%';

        const kill = cp.spawn('/usr/bin/amixer',
                              ['-D', 'pulse', 'sset', 'Master', percent]);
        
        this.journal.log('Volume changed to ' + this.player.volume + '%');

        kill.stderr.on('data', (data) => {
            this.journal.log(`stderr: ${data}`);
        });
    }
}
/*------------------------------------------------------------------------*/
