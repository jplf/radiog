import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Device } from './device.interface';

import * as cp from 'child_process';

@Injectable()
export class DeviceService {

    constructor(private journal: Journal,
                private configService: ConfigService) {};

    // The current output bluetooth device
    private readonly device: Device = {
        name: this.configService.get<string>('DEV_NAME'),
        alias: this.configService.get<string>('DEV_ALIAS'),
        address: this.configService.get<string>('DEV_ADDRESS'),
        trusted: false,
        paired: false,
        connected: false
    };

    // Returns the current device
    getDevice(): Device {
        return this.device;
    }

    // Returns the current device name
    name(): string {
        return this.device.name;
    }

    /**
     * Gets the current parameters of the bluetooth device.
     * It returns a promise which will be resolved by nestjs
     */
    info() : Promise<Device> {

        // Sends 'info' to bluetoothctl
        const cmd: string = this.btctl('info');

        return new Promise<Device> ((resolve, reject) => {

            cp.exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    this.journal.log('Call to bluetoothctl failed');
                    return;
                }
                this.parseInfo(`${stdout}`)
                resolve(this.device);
            });
        });
    }

    /**
     * Finds some interesting parameters in the output of bluetoothctl
     * Parsing could be smarter.
     */
    private parseInfo(data) : void {

        const list = data.split(/\n/);

        for (const item of list) {

            if (item.match(/Name:/)) {
                const regexp = new RegExp(this.device.name);

                if(! regexp.test(item)) {
                    this.journal.log('Invalid device name : '
                                     + regexp + ' != ' + item);
                    return;
                }
            }
            else if (item.match(/Alias:/)) {
                this.journal.log('Device ' + item.trim());
            }
            else if (item.match(/Paired:/)) {
                this.device.paired = /yes/.test(item);
            }
            else if (item.match(/Trusted:/)) {
                this.device.trusted = /yes/.test(item);
            }
            else if (item.match(/Connected:/)) {
                this.device.connected = /yes/.test(item);
            }
            else {
                continue;
            }
        }
    }

    // Connects the current device
    connect(): void {

         // Sends 'connect' to bluetoothctl
        const cmd : string = this.btctl('connect');
        cp.execSync(cmd);

        //this.journal.log(out.toString());
        this.journal.log('Device connected');
    }

    // Disconnects the current device
    disconnect(): void {

        const cmd : string = this.btctl('disconnect');
        cp.execSync(cmd);

        //this.journal.log(out.toString());
        this.journal.log('Device disconnected');
    }

    // Builds the bluetoothctl command
    private btctl(command: string) : string {

        return 'echo ' + command + ' ' + this.device.address
            + ' | /usr/bin/bluetoothctl';
    }
}
