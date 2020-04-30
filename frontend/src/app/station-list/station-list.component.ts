import { Component, OnInit } from '@angular/core';
import { Station }  from '../station/station';
import { StationService } from '../station/station.service';
import { MessageService } from '../messages/message.service';
import { LoggerService }  from '../messages/logger.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})

export class StationListComponent implements OnInit {

    constructor(private stationService: StationService,
                private loggerService: LoggerService,
                private messageService: MessageService) {}
    
    stationList: Station[] = [];
    selectedStation: Station;

    ngOnInit(): void {
        this.stationService.fetchStationList()
            .subscribe((data) => {
                this.stationList = JSON.parse(JSON.stringify(data));
                this.loggerService.log('Fetched stations : '
                                       + this.stationList.length);
            });
    }

    getStationList(): Station[] {
        return this.stationList;
    }    
    
    onSelect(s: Station): void {
        this.selectedStation = s;
        this.loggerService.log('Selected station : ' + s.name);
    }
}
