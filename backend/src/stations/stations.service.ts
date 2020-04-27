import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Station } from './station.interface';

import * as fs from 'fs';

@Injectable()
export class StationsService {
    
    private stations: Station[] = [];
    
    constructor(private journal: Journal,
                private configService: ConfigService) {};

    async load() : Promise<Station[]> {
        var path = this.configService.get<string>('STATION_LIST');
        this.journal.log('List of stations in ' + path);
        
        var content = fs.readFileSync(path, 'utf-8');
        this.stations = JSON.parse(content).stations;
        this.journal.log('Number of stations : ' + this.stations.length);

        return this.stations;
    }

    get(key : string) : Station {

        return this.stations.find(s => s.key === key);
    }
    
}
