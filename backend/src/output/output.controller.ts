/**
 * A component of the backend application
 * It routes the incoming requests to the output service
 * Usage : curl http://localhost:3000/output
 */
import { Controller, Get, Logger } from '@nestjs/common';
import { Journal } from '../journal/journal.service';
import { OutputService } from './output.service';

@Controller('output')
export class OutputController {

    constructor(private outputService: OutputService,
                private journal: Journal) {
    }

    /**
     * Just gives back the name of the current output device.
     */
    @Get()
    async name() : Promise<string> {

        this.journal.log('Current output: ' + this.outputService.name());

        return JSON.stringify(this.outputService.name());
    }
    /**
     * Gets more info about this output
     */
    @Get('info')
    async info() : Promise<string> {

        this.journal.log('Current output information');

        return JSON.stringify("Not yet implemented");
    }

    /**
     * Returns the list of available devices
     */
    @Get('list')
    outputList(): Promise<string[]> {

        this.journal.log('Available output devices');
        
        return this.outputService.getDeviceNames();
    }
    /**
     * Returns the status of the current output
     * curl -s http://localhost:3000/output/status|jq
     */
    @Get('status')
    status(): string {
        return JSON.stringify(this.outputService.getDevice());
    }

}
/*------------------------------------------------------------------------*/
