import { Component, OnInit } from '@angular/core';
import { RadioService } from '../radio.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})

export class RadioComponent implements OnInit {

    constructor(private radioService: RadioService) { }

    ngOnInit(): void {
    }


    onOff: boolean;
    
    onSwitch(value: boolean): void {
        
        this.radioService.switch(value);
        this.radioService.displayStatus();
    }
}
