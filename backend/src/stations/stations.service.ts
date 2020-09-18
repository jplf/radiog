import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Station } from './station.interface';

const fs = require('fs').promises;

/**
 * This service manages the list of stations.
 */
@Injectable()
export class StationsService {
    
    private stations: Station[] = [];
    
    constructor(private journal: Journal,
                private configService: ConfigService) {};

    // Loads the list from a file. Called from main.ts
    // The file path is given in the configuration
    async load() : Promise<string[]> {
        
        var path = this.configService.get<string>('RADIOG_HOME') + '/'
        + this.configService.get<string>('STATION_LIST');
        
        this.journal.log('Stations in ' + path);
        
        return Promise.resolve(path)
            .then(file => {
                return fs.readFile(file, 'utf-8');
            })
            .then(content => {
                var list = JSON.parse(content).stations;
                this.stations = list.map(e => ({ ... e }));
                this.size();
                
                return list;
            })
           .catch((err) => {
               console.log("The list of stations is not found in "
                           + path + ' : '
                           + err);
            });
    }
    
    // Returns the number of known stations.
    size() : string {
        var nbr = this.stations.length.toString();
        this.journal.log('Number of stations : '  + nbr);
        return nbr;
    }
  
    // Retrieves the list of stations.
    getList() : Station[] {
        this.journal.log('List of stations fetched');
        return this.stations;
    }
  
    // Retrieves a station object knowing its key.
    get(key : string) : Station {
        
        var station = this.stations.find(s => s.key === key);
        
        if (station == undefined) {
           this.journal.log('Cannot find station ' + key); 
        }
        
        return station;
    }
}
