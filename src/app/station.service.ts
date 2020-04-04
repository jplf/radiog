import { Injectable } from '@angular/core';
import { Station } from './station';
import { STATIONS } from './station-list';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class StationService {

    constructor(private messageService: MessageService) {}
    
    getStations(): Station[] {
        return STATIONS;
    }
}
