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

    // Guesses what is the default bt controller
    // The case where there is more than one controller is not managed
    getBtController(): string {

        try {
            // Finds the default bt controller' name
            const cmd: string = 'echo show ' + 
                  ' | /usr/bin/bluetoothctl 2>/dev/null';
            
            const result: string = cp.execSync(cmd).toString();
            
            const list = result.split(/\n/);
            let btCtrl: string = '';

            for (const item of list) {
                if (item.match(/Controller /)) {
                    btCtrl =  item.trim();
                }
                else if (item.match(/Name:/)) {
                    btCtrl +=  ' ' + item.trim();
                }
                else if (item.match(/Alias:/)) {
                    btCtrl +=  ' ' + item.trim();
                }
                
                return 'Controller ' + btCtrl;
            }
            
            this.journal.log(result);
        }
        catch(e) {
            this.journal.log('Error: ' + e);
            return null;
        }
    }

    // Gets the list of available devices
    // Returns the array of MAC addresses
    // NOT YET IMPLEMENTED
    getBtDevices(): string[] {

        try {
            // Get le list of devices. Calling bluetoothctl is not easy
            const cmd: string = 'echo quit ' + 
                  ' | /usr/bin/bluetoothctl devices | fgrep Device';
            
            const result: string = cp.execSync(cmd).toString();
            
            const list = result.split(/\n/);
            let adresses: string[];

            for (const item of list) {
                if (item.match(/Controller /)) {
                    adresses.push(item.trim());
                }
                
                return adresses;
            }
            
            this.journal.log(result);
        }
        catch(e) {
            this.journal.log('Error: ' + e);
            return null;
        }
    }


    // Fetches the list of device using the default bt controller
    loadDeviceList(): void {
    }

    // Returns the device name
    name(device: Device): string {
        return device.name;
    }
    
    // Simply returns true if the device is connected
    isConnected(device: Device): boolean {
        return device.connected;
    }
    
    // Returns true if the device exists and is connected
    isReallyConnected(device: Device): boolean {
        
        if (device == null) {
            this.journal.log('Invalid device to test');
            return false;
        }

        const cmd: string = 'echo info ' + device.address
              + ' | /usr/bin/bluetoothctl 2>/dev/null | fgrep Connected';
        
        const result: string = cp.execSync(cmd).toString();
        
        this.journal.log(result);
        
        const status = result.indexOf('yes') !== -1;
        device.connected = status;
              
        return status;
    }

    /**
     * Gets the current parameters of a bluetooth device.
     * It returns a promise which will be resolved by nestjs.
     */
    info(device: Device) : Promise<Device> {
        
        if (device == null) {
            return Promise.reject('Invalid device to scan');
        }

        // Sends 'info' to bluetoothctl
        const cmd: string = this.btctl('info', device);

        return new Promise<Device> ((resolve, reject) => {

            cp.exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    this.journal.log('Call to bluetoothctl failed');
                    return;
                }
                this.parseInfo(`${stdout}`, device)
                resolve(device);
            });
        });
    }

    /**
     * Finds some interesting parameters in the output of bluetoothctl
     * Parsing could be smarter.
     */
    private parseInfo(data: string, device: Device) : void {

        const list = data.split(/\n/);

        for (const item of list) {

            if (item.match(/Name:/)) {
                const regexp = new RegExp(device.name);

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
                device.paired = /yes/.test(item);
            }
            else if (item.match(/Trusted:/)) {
                device.trusted = /yes/.test(item);
            }
            else if (item.match(/Connected:/)) {
                device.connected = /yes/.test(item);
            }
            else {
                continue;
            }
        }
    }

    // Connects the specified device
    connect(device: Device): void {

        // Avoids calling the bt controller
        if (this.isConnected(device)) {
            return;
        }

        // Sends 'connect' to bluetoothctl
        const cmd : string = this.btctl('connect', device);
        cp.execSync(cmd);

        //this.journal.log(out.toString());
        this.journal.log('Device connected');
        device.connected = true;
    }

    // Disconnects the specified device
    disconnect(device: Device): void {
        
        // Avoids calling the bt controller
        if (! this.isConnected(device)) {
            return;
        }

        const cmd : string = this.btctl('disconnect', device);
        cp.execSync(cmd);

        //this.journal.log(out.toString());
        this.journal.log('Device disconnected');
        device.connected = false;
    }

    // Builds the bluetoothctl command
    private btctl(command: string, device: Device) : string {
        
        if (device == null) {
            this.journal.log('Invalid device to check');
            return null;
        }

        return 'echo ' + command + ' ' + device.address
            + ' | /usr/bin/bluetoothctl';
    }
}
