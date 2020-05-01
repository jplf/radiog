import { Injectable } from '@angular/core';
import { Station } from './station';
import { MessageService } from '../messages/message.service';
import { LoggerService }  from '../messages/logger.service';

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse }  from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { config } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Implements the management of the stations
 */
export class StationService {

    constructor(private messageService: MessageService,
                private loggerService: LoggerService,
                private http: HttpClient) {}

    // Retrieves the list of stations from the backend server.
    fetchStationList() {

        var url = config.backend_player + 'station-list';
        return this.http.get(url, {
                                 headers: {'Access-Control-Allow-Origin': '*'},
                                 observe: 'body',
                                 responseType: 'json'
                             })
            .pipe(catchError(this.handleError));
    }

    // Take care of possible errors
    private handleError(error: HttpErrorResponse) {
        
        if (error.error instanceof ErrorEvent) {
            this.loggerService.log('Client error: ' + error.error.message);
        } else {
            console.log(`Backend error ${error.status} ${error.message}`);
        }
        
        return throwError('Cannot process the request to the backend');
    };
        
    // The current selected station
    selectedStation: Station;

    // Sets the current station
    setSelectedStation(s: Station): void {
        this.selectedStation = s;
    }
    
    // Gets the current station
    getSelectedStation(): Station {
        return this.selectedStation;
    }

}
