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
    // Returns the array with the MAC addresses and the alias set
    getBtDevices(): Device[] {

        try {
            // Gets the list of devices. Calling bluetoothctl is not easy
            // See discussions about that in the web. Bluetoothctl sucks.
            const cmd: string = 'echo quit ' + 
                  ' | /usr/bin/bluetoothctl devices | fgrep Device';
            
            const result: string = cp.execSync(cmd).toString();
            
            const list = result.split(/\n/);
            let devices: Device[]=  [];
            
            for (const item of list) {
                // For each device found take the mac address and the alias
                // Since alias may contain white space it's a pain in the ass
                // to parse the strings
                if (item.match(/Device /)) {
                    let dev = this.createDevice(item);
                    devices.push(dev);
                }
            }
            
            return devices;
        }
        catch(e) {
            console.log('Error: ' + e);
            this.journal.log('Error: ' + e);
            return null;
        }
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
    info(address: string) : Promise<Device> {
        
        if (address == null) {
            return Promise.reject('Invalid device to scan');
        }

        // Sends 'info' to bluetoothctl
        const cmd: string = this.btctl('info', address);

        return new Promise<Device> ((resolve, reject) => {

            cp.exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    this.journal.log('Call to bluetoothctl failed');
                    reject(error);
                    return;
                }
                
                let device: Device = {
                    name : 'undef', alias : '',
                    address : address,
                    trusted : false, paired : false, connected : false
                };
 
                this.parseInfo(`${stdout}`, device);
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
            
            if (item.match(/Device /)) {
                
                const chunks = item.split(/ /);
                
                if(chunks[3] != device.address) {
                  continue;
                }
            }
            else if (item.match(/Name:/)) {
                const i = item.indexOf(':') + 1;
                device.name = item.substr(i).trim();
                
                this.journal.log('Device ' + item.trim());
            }
            else if (item.match(/Alias:/)) {
                const i = item.indexOf(':') + 1;
                device.alias = item.substr(i).trim();

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
        const cmd : string = this.btctl('connect', device.address);
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

        const cmd : string = this.btctl('disconnect', device.address);
        cp.execSync(cmd);

        //this.journal.log(out.toString());
        this.journal.log('Device disconnected');
        device.connected = false;
    }

    // Builds the bluetoothctl command for a specific device
    private btctl(command: string, address: string) : string {
        
        if (address == null) {
            this.journal.log('Invalid device to check');
            return null;
        }

        return 'echo ' + command + ' ' + address
            + ' | /usr/bin/bluetoothctl';
    }
    
    // Creates a device from the content of a line output by bt controller
    // Returns the device
    private createDevice(line: string): Device {
        
        let device: Device = {
                name : '',
                alias : '',
                address : '',
                trusted : false, paired : false, connected : false
        };

        // junk  [NEW] Device C0:28:8D:36:20:97 BOOM VLF
        const chunks = line.split(/ /);
        const word = chunks[2];
        
        // Make sure the line is a correct one
        if (word != 'Device') {
            throw new Error(word + ' is not what is expected');
        }
        // This should be the MAC address
        device.address = chunks[3];
        
        // The rest is the alias which may containe space
        let str: string = '';
        for (var  i = 4; i < chunks.length; i++) {
            str = str + chunks[i] + ' ';
        }
        device.alias = str.trim();
         
        return device;
    }
}
