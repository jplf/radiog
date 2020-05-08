import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Journal } from '../journal/journal.service';
import { DeviceService } from './device.service';

/*
 * Manages the bluetooth output device
 * See also : bluetoothctl(1)
 */
@Controller('device')
export class DeviceController {
    
    constructor(private deviceService: DeviceService,
                private journal: Journal,
                private configService: ConfigService) {
    };

    // Just gives back the name of the device
    @Get()
    name() : string {
        
        return JSON.stringify(this.deviceService.name());
    }

    //  Gets more info about the device
    @Get('info')
    async info() : Promise<string> {
        
        this.journal.log('Current device information');

        return JSON.stringify(await this.deviceService.info());
    }

    // Tries to get connected to the bluetooth device
    @Get('connect')
    connect() : void {
        
        this.journal.log('Connecting to ' + this.deviceService.name());
        this.deviceService.connect();
    }
}
