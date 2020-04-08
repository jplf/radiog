import { Component, OnInit } from '@angular/core';
import { RadioService } from '../radio.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})

export class RadioComponent implements OnInit {

    constructor(private radioService: RadioService) { console.log('built')}

    ngOnInit(): void {
    }

    onOff: boolean;
    
    onSwitch(value: boolean): void {
        this.radioService.switch(value);
    }
    
    volume: number;
    
    onChange(value: number): void {
        this.radioService.setVolume(value);
    }
}
export class NgbdTooltipDelay {
}
