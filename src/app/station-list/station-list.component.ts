import { Component, OnInit } from '@angular/core';
import { Station }  from '../station';
import { StationService } from '../station.service';
import { MessageService } from '../message.service';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})

export class StationListComponent implements OnInit {

    constructor(private stationService: StationService,
                private loggerService: LoggerService,
                private messageService: MessageService) {}

    ngOnInit(): void {
        this.getStationList();
        this.selectedStation = this.stationList[0];
        this.loggerService.log("StationList component ready");
    }

    stationList: Station[];
     
    getStationList(): void {
        this.stationList = this.stationService.getStationList();
    }    

    selectedStation: Station;
    
    onSelect(s: Station): void {
        this.selectedStation = s;
        this.loggerService.log('Selected station : ' + s.name);
    }
}
