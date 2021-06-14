import { Controller } from '@nestjs/common';
import { Journal } from '../journal/journal.service';
import { OutputService } from './output.service';

@Controller('output')
export class OutputController {
    
    constructor(private outputService: OutputService,
                private journal: Journal) {
    }
}
