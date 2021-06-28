import { Controller, Get, Logger } from '@nestjs/common';
import { Journal } from '../journal/journal.service';
import { OutputService } from './output.service';

@Controller('output')
export class OutputController {
    
    constructor(private outputService: OutputService,
                private journal: Journal) {
    }
    
    // Just gives back the name of the device
    @Get()
    async name() : Promise<string> {
//        Logger.log(this.outputService.name());
        return JSON.stringify(this.outputService.name());
    }

}
