import { Component, OnInit, Input } from '@angular/core';
import { OnChanges, SimpleChange } from '@angular/core';
import { RadioService } from './radio.service';
import { LoggerService }  from '../messages/logger.service';
import { StationService } from '../station/station.service';
import { MessageService } from '../messages/message.service';
import { Station } from '../station/station';
import { Player } from '@backend/player.interface';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})

/**
 * Switch on or off the radio
 */
export class RadioComponent implements OnInit, OnChanges {

    @Input() station: Station = undefined;

    constructor(private stationService: StationService,
                private loggerService: LoggerService,
                private messageService: MessageService,
                private radioService: RadioService) {
        
        // Get the player status
        this.radioService.fetchPlayer()
            .subscribe((data : string) => {
                this.player = JSON.parse(JSON.stringify(data));
                
                this.loggerService.log(this.player.version);
                this.volume = this.player.volume;
                this.onOff  = this.player.switchedOn;
                
                this.loggerService.log('Radio : ' + this.player.source);
                this.stationService.setSelectedSource(this.player.source);
                
            },
                       error => {
                           this.messageService.display(error);
                       });
    }

    // Whether the player is playing (true) or not (false)
    onOff: boolean = undefined;
    
    // The volume value
    volume: number = undefined;
    
    private player: Player = undefined;

    // Gets initial values from the backend
    ngOnInit(): void {
        this.loggerService.log('Initializing PlayerComponent !');
        return;
    }

    // If playing and if the station is changed restarts the player
    ngOnChanges(changes: {[propKey: string]: SimpleChange}) {

        if (changes.station === undefined) {
            return;
        }

        // The radio is off so do nothing
        if ( !this.onOff) {
            return;
        }
        
        this.loggerService.log('Station changed from '
                               + changes.station.previousValue.name + ' to '
                               + this.station.name);

        var value = true;
        this.radioService.switchOnOff(value, this.station.key)
            .subscribe(data => {
                this.loggerService.log('New station '
                                       + this.station.name + ' on');
            },
                       error => {
                           this.messageService.display(error);
                       });
        
    }

    // Switch on or off the radio
    onSwitch(): void {

        if (this.station === undefined) {
            this.loggerService.log('Current station is undefined');
            return;
        }
        // Toggle the status
        var value = ! this.onOff; 
        
        this.radioService.switchOnOff(value, this.station.key)
            .subscribe(data => {
                this.onOff = value;
                var status = value ? 'On' : 'Off';
                
                this.messageService.display('Radio ' + status);
                this.loggerService.log('Station ' + this.station.name
                                       + ' ' + status);
            },
                      error => {
                          this.messageService.display(error);
                      });
    }

    /**
     * Manage the volume
     */
    onChange(value: number): void {
        this.radioService.setVolume(value)
            .subscribe(data => {
                this.messageService.display('Volume ' + value);
            },
                       error => {
                           this.messageService.display(error);
                       });
    }
}

export class NgbdTooltipDelay {
}
