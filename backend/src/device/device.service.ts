import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Device } from './device.interface';

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

    // Returns the current device name
    name(): string {
        return this.device.name;
    }

    // Returns information about the current device
    info(): Device {
        return this.device;
    }

    // Connect the current device
    connect(): void {
        this.journal.log('Connection to the device');
    }

}
