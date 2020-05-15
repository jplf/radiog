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
    
    // The array of stations
    stationList: Station[] = [];

    constructor(private messageService: MessageService,
                private loggerService: LoggerService,
                private http: HttpClient) {
        
        // The list of stations is fetched from the backend server
        this.fetchStationList()
            .subscribe(data => {
                this.stationList = JSON.parse(JSON.stringify(data));
                this.loggerService.log('Number of fetched stations : '
                                       + this.stationList.length);
                
            },
                       error => {
                           this.messageService.display(error);
                       });
    }

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
        
        return throwError('Cannot get the stations from the backend');
    };

    // Returns the list of stations
    getStationList(): Station[] {
        return this.stationList;
    }    
        
    // The current selected station
    selectedStation: Station;

    // Sets the current station
    setSelectedStation(station: Station): void {
        this.selectedStation = station;
    }

    // Sets the current station knowing the source
    setSelectedSource(source: string): void {
        this.setSelectedStation(this.findStation(source));
    }
    
    // Gets the current station
    getSelectedStation(): Station {
        return this.selectedStation;
    }
    
    // Finds the station object knowing the source
    findStation(source : string): Station {
        if (source == null || undefined) {
            this.loggerService.log('No source to find !');
            return undefined;
        }
        this.loggerService.log('Finding ' + source);
        return this.stationList.find(station => station.stream == source);
    }

}
