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
     * Returns the list of available devices
     */
    @Get('output-list')
    outputList(): {

        this.journal.log('Available output devices');

        return JSON.stringify(this.outputService.name());
    }

}
/*------------------------------------------------------------------------*/
