import { Component, OnInit } from '@angular/core';
import { Station }  from '../station';
import { StationService } from '../station.service';
import { MessageService } from '../message.service';
import { RadioService } from '../radio.service';

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
    }

    stationList: Station[];
     
    getStationList(): void {
        this.stationList = this.stationService.getStationList();
    }    

    selectedStation: Station;
    
    onSelect(s: Station): void {
        this.selectedStation = s;
        this.messageService.display(`${s.id} ${s.name}`)
    }
    
    onOff: Boolean;

    onSwitch(value: Boolean): void {
        
        var radioStatus;
        this.onOff = value;
        
        if (value) {
            radioStatus = 'Radio is switched off'
        }
        else {
            radioStatus =  'Radio is switched on'
        }
        
        this.messageService.display(radioStatus)
    }
}