import { Component, OnInit } from '@angular/core';
import { RadioService } from './radio.service';
import { LoggerService }  from '../messages/logger.service';
import { StationService } from '../station/station.service';
import { MessageService } from '../messages/message.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})

/**
 * Switch on or off the radio
 */
export class RadioComponent implements OnInit {

    constructor(private radioService: RadioService,
                private loggerService: LoggerService,
                private messageService: MessageService,
                private stationService: StationService) {

    }
    
    onOff: boolean;

    ngOnInit(): void {
        this.loggerService.log('Radio component ready');
    }


    // Switch on or off the radio
    onSwitch(): void {

        var value = ! this.onOff; 
        
        var station = this.stationService.getSelectedStation();
        
        this.radioService.switchOnOff(value, station.key).subscribe((data) => {
            
            this.onOff = value;
            var status = value ? 'On' : 'Off';
            
            this.messageService.display('Radio ' + status);
            this.loggerService.log('Status of ' + station.name + ' ' + status);
        });
    }

    /**
     * Manage the volume
     */
    volume: number;
    
    onChange(value: number): void {
        this.radioService.setVolume(value);
    }
}
export class NgbdTooltipDelay {
}
