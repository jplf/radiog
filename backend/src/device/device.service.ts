import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Device } from './device.interface';

import * as cp from 'child_process';

@Injectable()
export class DeviceService {

    constructor(private journal: Journal,
                private configService: ConfigService) {};

    // The list of bluetooth devices
    private deviceList: Device[];

    // Fetches the list of device using the default controller
    loadDeviceList(): void {

        try {
            // Finds the default controller' name
            const cmd: string = 'echo show ' + 
                  ' | /usr/bin/bluetoothctl 2>/dev/null';
            
            const result: string = cp.execSync(cmd).toString();
            
            const list = result.split(/\n/);
            const controller: string = '';

            for (const item of list) {
                if (item.match(/Controller /)) {
                    controller =  item.trim();
                }
                else if (item.match(/Name:/)) {
                    controller +=  ' ' + item.trim();
                }
                else if (item.match(/Alias:/)) {
                    controller +=  ' ' + item.trim();
                }
                
                this.journal.log('Controller ' +controller );
            }


            
            this.journal.log(result);
        }
        catch(e) {
           this.journal.log('Error:', e);
        }
        
    }

    // The current output bluetooth device
    private device: Device = {
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

    // Changes the current device
    setDevice(dev: Device) {
        
        if (dev == null) {
            this.journal.log('Null device to clone');
            this.device = null;
            return;
        }
        
        this.device = JSON.parse(JSON.stringify(dev));
    }

    // Returns the current device name
    name(): string {
        return this.device.name;
    }

    // Returns true if the device is the current device
    isCurrent(dev: Device): boolean {
        
        if (dev == null) {
            return false;
        }

        return dev.address === this.device.address;
    }
    
    // Returns true if the device is connected
    isConnected(dev: Device): boolean {
        
        if (dev == null) {
            this.journal.log('Invalid device to test');
            return false;
        }

        const cmd: string = 'echo info ' + dev.address
              + ' | /usr/bin/bluetoothctl 2>/dev/null | fgrep Connected';
        
        const result: string = cp.execSync(cmd).toString();
        
        this.journal.log(result);
              
        return result.indexOf('yes') !== -1;
    }

    /**
     * Gets the current parameters of the bluetooth device.
     * It returns a promise which will be resolved by nestjs
     */
    info(dev?: Device) : Promise<Device> {

        const device: Device = (dev == null) ? this.device : dev;

        // Sends 'info' to bluetoothctl
        const cmd: string = this.btctl('info');

        return new Promise<Device> ((resolve, reject) => {

            cp.exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    this.journal.log('Call to bluetoothctl failed');
                    return;
                }
                this.parseInfo(`${stdout}`)
                resolve(device);
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
