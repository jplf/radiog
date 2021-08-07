import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Output } from './output.interface';
import { Device } from '../device/device.interface';
import { DeviceService } from '../device/device.service';

@Injectable()
export class OutputService {

    constructor(private journal: Journal,
                private deviceService: DeviceService,
                private configService: ConfigService) {
        
        this.deviceService.loadBtDevices();
    }

    private output: Output = {
        name: this.configService.get<string>('DEV_NAME'),
        bluetooth: this.configService.get<boolean>('DEV_BLUE'),
        device: {
            name: this.configService.get<string>('DEV_NAME'),
            alias: this.configService.get<string>('DEV_ALIAS'),
            address: this.configService.get<string>('DEV_ADDRESS'),
            trusted: false,
            paired: false,
            connected: false
        }
    };
    

    // Changes the current output device using its alias
    setDeviceAka(deviceAlias: string): void {
        
        let device = this.deviceService.findDeviceAka(deviceAlias);
        if (! device) {
            this.journal.log('Cannot find device named ' + deviceAlias);
            return;
        }
        console.log(device);
        this.setDevice(device);
    }
    
    // Returns the current bt device
    getDevice(): Device {
        return this.output.device;
    }

    // Changes the current device
    setDevice(device: Device) {
        
        if (device == null) {
            this.journal.log('Null device to clone');
            this.output.device = null;
            return;
        }
        
        this.output.device = { ...device };
    }

    // Returns true if the device is the current device
    isCurrent(device: Device): boolean {
        
        if (device == null) {
            return false;
        }

        return device.address === this.output.device.address;
    }

    // Returns the current output
    getOutput(): Output {
        return this.output;
    }

    // Returns the current output name
    name(): string {
        return this.output.name;
     }

    // Returns true if the output is a bluetooth device
    isBluetooth(): boolean {
        
        if (this.output == null) {
            return false;
        }

        return this.output.bluetooth;
    }
}
