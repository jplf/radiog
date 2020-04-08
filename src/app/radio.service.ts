import { Injectable } from '@angular/core';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class RadioService {
    
    constructor(private messageService: MessageService) {}

    on : boolean = false;
    
    switch(status : boolean) {
        this.on = status;
        this.displayStatus();
    }

    getStatus() : boolean {
        return this.on;
    }

    displayStatus() : void {
        
        var radioStatus;
        
        if (this.on) {
            radioStatus = 'Radio is switched off';
        }
        else {
            radioStatus = 'Radio is switched on';
        }
        
        this.messageService.display(radioStatus);
    }
    
    volume: number = 40;
    
    setVolume(value: number) {
        this.volume = value;
    }
}
