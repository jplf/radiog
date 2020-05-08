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

    // Returns information about the current device
    info() : Promise<Device> {
        
        var cmd : string = 'echo info ' + this.device.address
            + ' | /usr/bin/bluetoothctl';
        
        return new Promise<Device> ((resolve, reject) => {
            
            cp.exec(cmd, (error, stdout, stderr) => {
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
        
        var list = data.split(/\n/);
                
        for (let item of list) {
            
            if (item.match(/Name:/)) {
                var regexp = new RegExp(this.device.name);
                
                if(! regexp.test(item)) {
                    this.journal.log('Invalid device name : '
                                     + regexp + ' != ' + item);
                    return;
                };
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
    
    // Connect the current device
    connect(): void {
        this.journal.log('Connection to the device');
    }

}
