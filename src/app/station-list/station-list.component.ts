import { Component, OnInit } from '@angular/core';
import { Station }  from '../station';
import { StationService } from '../station.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss']
})

export class StationListComponent implements OnInit {

    constructor(private stationService: StationService,
                private messageService: MessageService) {}

    ngOnInit(): void {
        this.getStationList();
        this.selectedStation = this.stationList[0];
    }

    stationList: Station[];
     
    getStationList(): void {
        this.stationList = this.stationService.getStationList();
    }    

    selectedStation: Station;
    
    onSelect(s: Station): void {
        this.selectedStation = s;
    }
}
