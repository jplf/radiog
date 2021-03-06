import { Component, OnInit, Input } from '@angular/core';
import { Station } from '../station/station';
import { StationService } from '../station/station.service';
import { MessageService } from '../messages/message.service';
import { LoggerService } from '../messages/logger.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})

/**
 * Manages the list of radio stations.
 */
export class StationListComponent implements OnInit {

    constructor(private stationService: StationService,
                private loggerService: LoggerService,
                private messageService: MessageService) {

        // The list of stations is fetched from the backend server
        this.stationService.fetchStationList()
            .subscribe(data => {
                this.stationList = JSON.parse(JSON.stringify(data));
                this.loggerService.log('Number of fetched stations : '
                                       + this.stationList.length);

            },
                       error => {
                           this.messageService.display(error);
                       });
    }

    @Input() station: Station;

    // The array of stations
    stationList: Station[] = [];

    ngOnInit(): void {
        this.loggerService.log('Initializing StationListComponent !');
    }

    // Returns the list of stations
    getStationList(): Station[] {
        return this.stationList;
    }

    // Sets the current station
    onSelect(s: Station): void {
        if (s === undefined) {
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
