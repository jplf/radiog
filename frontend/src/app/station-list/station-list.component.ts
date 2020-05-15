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
        this.loggerService.log('Initializing !');
    }

    ngDoCheck() {
        // Initializes when starting
        if (this.stationList.length < 1) {
            this.loggerService.log('DoCheck StationListComponent !');
            this.stationList = this.stationService.getStationList();
            
            var s : Station = this.getSelectedStation();
            if (s == undefined) {
                this.loggerService.log('No selected station yet !');
            }
            else {
                this.loggerService.log('Selected : ' + s.name);
            }
        }
   }
    
    // Returns the list of stations
    getStationList(): Station[] {
        return this.stationService.getStationList();
    }    

    // Sets the current station
    onSelect(s: Station): void {
        if (s == undefined) {
            return;
        }
        this.stationService.setSelectedStation(s);
        this.loggerService.log('Selected station : ' + s.name);
    }
        
    // Gets the current station
    getSelectedStation(): Station {
        return this.stationService.getSelectedStation();
    }
}
