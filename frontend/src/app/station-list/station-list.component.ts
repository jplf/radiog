import { Component, OnInit, DoCheck } from '@angular/core';
import { Station }  from '../station/station';
import { StationService } from '../station/station.service';
import { MessageService } from '../messages/message.service';
import { LoggerService }  from '../messages/logger.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})

/**
 * Manages the list of radio stations.
 */
export class StationListComponent implements OnInit, DoCheck {

    constructor(private stationService: StationService,
                private loggerService: LoggerService,
                private messageService: MessageService) {
 
   }

    // The array of stations
    stationList: Station[] = [];

    ngOnInit(): void {
        console.log('Initializing !');
    }

    ngDoCheck() {
        // Initializes when starting
        if (this.stationList.length < 1) {
            console.log('DoCheck !');
            this.stationList = this.stationService.getStationList();
            this.getSelectedStation();
        }
   }
    
    // Returns the list of stations
    getStationList(): Station[] {
        return this.stationService.getStationList();
    }    

    // Sets the current station
    onSelect(s: Station): void {
        this.stationService.setSelectedStation(s);
        this.loggerService.log('Selected station : ' + s.name);
    }
        
    // Gets the current station
    getSelectedStation(): Station {
        return this.stationService.getSelectedStation();
    }

}
