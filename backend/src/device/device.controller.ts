import { Controller, Get } from '@nestjs/common';
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
                private journal: Journal) {
    };

    // Just gives back the name of the device
    @Get()
    async name() : Promise<string> {

        return JSON.stringify(await this.deviceService.name());
    }

    /**
     * Gets more info about the device
     * It took me a long time to figure out how to use async & await
     * to finally returns the result of bluetoothctl.
     */
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

    // Disconnected to the bluetooth device
    @Get('disconnect')
    disconnect() : void {

        this.journal.log('Disconnecting from ' + this.deviceService.name());
        this.deviceService.disconnect();
    }
}
