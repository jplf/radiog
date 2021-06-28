import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Output } from './output.interface';

@Injectable()
export class OutputService {

    constructor(private journal: Journal,
                private configService: ConfigService) {
    }

    private output: Output = {
        name: this.configService.get<string>('DEV_NAME'),
        bluetooth: this.configService.get<boolean>('DEV_BLUE'),
        device: null
    };
    

    // Returns the current outpuy
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

    // Changes the current output device
    setDevice(deviceName: string) {
    }
}
