/**
 * Manages the list of available output devices.

 * It was very painful to write this code for 2 reasons.
 * Firstly the design of the application was completely modified,
 * and because mastering asynchronous programming took time.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Device } from './device.interface';

import * as cp from 'child_process';

@Injectable()
export class DeviceService {

    constructor(private journal: Journal,
                private configService: ConfigService) {};

    /**
     * The list of bluetooth device objects.
     * This list if built by the the unix command bluetoothctl(1) and kept
     * here to avoid calling bluetoothctl(1) many times.
     */
    private deviceList: Device[];

    /**
     * Guesses what is the default bluetooth controller.
     * The case where there is more than one controller is not managed.
     * It is a synchronous method
     *
     * @returns a string describing the controller
     */
    getBtController(): string {

        try {
            // Finds the default bt controller's name
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
    /**
     * Connects the specified device if it is not yet connected.
     * It is a synchronous method.
     * @param device the device to connect.
     */
    connect(device: Device): void {

        // Avoids calling the bt controller
        if (this.isConnected(device)) {
            return;
        }

        // Sends 'connect' to bluetoothctl
        const cmd : string = this.btctl('connect', device.address);
        cp.execSync(cmd);

        this.journal.log('Device connected');
        device.connected = true;
    }

    /**
     * Disconnects the specified device it is still connected.
     * It is a synchronous method.
     * @param device the device to disconnect.
     */
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

    /**
     * Gets a device knowing its alias.
     * It is an asynchronous method since the list must be already there.
     *
     * @params the alias used to identify the device.
     * @returns the device object.
     */
    findDeviceAka(alias: string): Device {
        return this.deviceList.find(device => device.alias === alias);
    }

    /**
     * Gets the number of known devices.
     * @returns the number.
     */
    numberOfDevices(): number {
        return this.deviceList.length;
    }

    /**
     * Loads the list of available devices and keeps it.
     * It is an asynchronous method.
     * @return the number of devices in a promise.
     */
    async loadBtDevices(): Promise<number> {

        let devices = await this.findBtDevices();
        this.deviceList = devices.slice();

        return new Promise((resolve) => {
            resolve(this.deviceList.length);
        });
    }

    /**
     * Gets the list of available devices.
     * Data are retrieved using the bluetoothctl(1) command
     * It is an asynchronous method.
     * @returns the array with the MAC addresses and the alias set.
     */
    findBtDevices(): Promise<Device[]> {
        
        // Gets the list of devices. Calling bluetoothctl is not easy
        // See discussions about that in the web. Bluetoothctl sucks.
        const cmd: string = 'echo quit ' + 
              ' | /usr/bin/bluetoothctl devices | fgrep Device';
        
        const result: string = cp.execSync(cmd).toString();

        
        const list = result.split(/\n/);
        
        let promisedDevices: Promise<Device>[] = [];
        
        for (const item of list) {
            /**
             * For each device found take the mac address and the alias.
             * Since alias may contain white space it's a pain in the ass
             * to parse the strings
             */
            if (item.match(/Device /)) {
                
                promisedDevices.push(this.createDevice(item));
             }
        }
        /**
         * This call is necessary since items are pushed asynchronously
         * in the array. Google to get more doc.
         */
        return Promise.all(promisedDevices);
    }

    /**
     * @returns the device name. Not really useful.
     * @param device the device object to check.
     * @return the name
     */
    name(device: Device): string {
        return device.name;
    }
    
    /**
     * Simply returns true if the device is connected.
     * Does not call bluetoothctl.
     * It is a synchronous method.
     * @param device object to check
     * @return true if it is connected.
     */
    isConnected(device: Device): boolean {
        return device.connected;
    }
    
    /**
     * Returns true if the device exists and is connected.
     * It checks the status by calling bluetoothctl.
     * It is a synchronous method. To be revisited.
     * 
     * @param device the device to check.
     * @return true if it is connected.
     */
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
     * Creates a device from the content of a line spit by bt controller.
     * It is a asynchronous method.
     * @param line the string to parse.
     * @returns the device as a promise.
     */
    createDevice(line: string): Promise<Device> {
        
        // line example : junk  [NEW] Device C0:28:8D:36:20:97 BOOM VLF
        const chunks = line.split(/ /);
        const word = chunks[2];
        
        // Make sure the line is a correct one
        if (word != 'Device') {
            throw new Error(word + ' is not what is expected');
        }
        
        // This should be the MAC address
        const address = chunks[3];
        
        return this.makeDevice(address);
    }

    /**
     * Gets the current parameters of a bluetooth device.
     * It is a asynchronous method.
     * @param adress the MAC address of a device.
     * @returns a device object as a promise.
     */
    makeDevice(address: string) : Promise<Device> {
        
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
     * Finds some interesting parameters in the output of bluetoothctl.
     * Parsing could be smarter.
     * It is a synchronous method.
     * @param data is the output of a call to bletoothctl.
     * @param device is passed and updated.
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

    /**
     * Builds the bluetoothctl command for a specific device.
     * The list of available commands is given by bluetoothctl help.
     * It is a synchronous method.
     * @param command is the command to execute
     * @param address it is the mac address of a device.
     */
    private btctl(command: string, address: string) : string {
        
        if (address == null) {
            this.journal.log('Invalid device to check');
            return null;
        }

        return 'echo ' + command + ' ' + address
            + ' | /usr/bin/bluetoothctl';
    }

    /**
     * Creates a device object.
     * It is a synchronous method.
     * @param line the content of a line spit by the bt controller
     * @return the device object.
     */
    private buildDevice(line: string): Device {
        
        let device: Device = {
                name : '', alias : '',
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
/*------------------------------------------------------------------------*/
