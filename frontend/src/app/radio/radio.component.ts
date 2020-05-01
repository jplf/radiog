import { Component, OnInit, Input } from '@angular/core';
import { OnChanges, SimpleChange } from '@angular/core';
import { RadioService } from './radio.service';
import { LoggerService }  from '../messages/logger.service';
import { StationService } from '../station/station.service';
import { MessageService } from '../messages/message.service';
import { Station } from '../station/station';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})

/**
 * Switch on or off the radio
 */
export class RadioComponent implements OnInit, OnChanges {

    @Input() station: Station;

    constructor(private radioService: RadioService,
                private loggerService: LoggerService,
                private messageService: MessageService,
                private stationService: StationService) {

    }

    // Whether the player is playing (true) or not (false)
    onOff: boolean;

    ngOnInit(): void {
        this.station = this.stationService.getSelectedStation();
        this.loggerService.log('Radio component ready');
    }

    // If playing and the station is changed restart the player
    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

        var oldKey = changes.station.previousValue.key;
        var newKey = changes.station.currentValue.key;

        // The radio is off so do nothing
        if ( !this.onOff) {
            return;
        }
        
        this.loggerService.log('Station changed from '
                               + changes.station.previousValue.name + ' to '
                               + this.station.name);

        var value = true;
        this.radioService.switchOnOff(value, this.station.key).subscribe(() => {
            
            this.loggerService.log('New station ' + this.station.name + ' on');
        });
        
    }


    // Switch on or off the radio
    onSwitch(): void {

        // Toggle the status
        var value = ! this.onOff; 
        
        this.radioService.switchOnOff(value, this.station.key).subscribe(() => {
            
            this.onOff = value;
            var status = value ? 'On' : 'Off';
            
            this.messageService.display('Radio ' + status);
            this.loggerService.log('Station ' + this.station.name
                                   + ' ' + status);
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
