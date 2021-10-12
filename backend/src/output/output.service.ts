/**
 * Manages the output device.
 *
 */
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
        
        deviceService.getDeviceList();
   }

    private output: Output = {
        name: this.configService.get<string>('DEV_NAME'),
        bluetooth: this.configService.get<boolean>('DEV_BLUE'),
        device: {
            name: this.configService.get<string>('DEV_NAME'),
            alias: undefined,
            address: undefined,
            trusted: false,
            paired: false,
            connected: false
        }
    };

    /**
     * Gets the list of available devices.
     * It is an asynchronous method.
     * @return the list.
     */
    async getDeviceList()  {
        
        await this.deviceService.getDeviceList();
    }

    /**
     * Changes the current output device using its alias.
     * @param deviceAlias the device identifier
     */
    setDeviceAka(deviceAlias: string): void {
        
        const device = this.deviceService.findDeviceAka(deviceAlias);
        if (! device) {
            this.journal.log('Cannot find device named ' + deviceAlias);
            return;
        }

        this.setDevice(device);
    }

    /**
     * Returns the current bt device
     * @return the device object.
     */
    getDevice(): Device {
        return this.output.device;
    }

    /**
     * Changes the current device
     * @param device the device object to set current.
     */
    setDevice(device: Device) {
        
        if (device == null) {
            this.journal.log('Null device to clone');
            this.output.device = null;
            return;
        }
        
        this.output.device = { ...device };
    }

    /**
     * Checks whether a device is current or not.
     * @param device the device object to check.
     * @return true if the device is the current device.
     */
    isCurrent(device: Device): boolean {
        
        if (device == null) {
            return false;
        }

        return device.address === this.output.device.address;
    }

    /**
     * Returns the current output
     * @return the output object
     */
    getOutput(): Output {
        return this.output;
    }
    
    /**
     * Returns the name of the current output object.
     * @return the name.
     */
    name(): string {
        return this.output.name;
     }

    /**
     * Checks whether the output is a bluetooth device or not.
     * @eturn true if the output is bluetooth.
     */
    isBluetooth(): boolean {
        
        if (this.output == null) {
            return false;
        }

        return this.output.bluetooth;
    }
}
/*------------------------------------------------------------------------*/
