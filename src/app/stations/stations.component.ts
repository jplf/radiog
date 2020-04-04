import { Component, OnInit } from '@angular/core';
import { Station }  from '../station';
import { StationService } from '../station.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})

export class StationsComponent implements OnInit {

    constructor(private stationService: StationService,
                private messageService: MessageService) {}

    ngOnInit(): void {
        this.getStations();
    }

    stations: Station[];
    
    getStations(): void {
        this.stations = this.stationService.getStations();
    }    

    setStation: Station;
    
    onSelect(s: Station): void {
        this.setStation = s;
    }
}
