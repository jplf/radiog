import { Injectable } from '@angular/core';
import { Station } from './station';
import { MessageService } from '../messages/message.service';
import { LoggerService } from '../messages/logger.service';
import { ConfigService } from '../config.service';

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
/**
 * Implements the management of the stations
 */
export class StationService {

    // The array of stations
    private stationList: Station[] = [];

    // The current selected station
    private selectedStation: Station;

    constructor(private messageService: MessageService,
                private loggerService: LoggerService,
                private configService: ConfigService,
                private http: HttpClient) {
    }

    // Retrieves the list of stations from the backend server.
    fetchStationList(): Observable<any> {

        const url = this.configService.playerUrl + 'station-list';
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
    }

    // Returns the list of stations
    getStationList(): Station[] {
        return this.stationList;
    }

    // Sets the current station
    setSelectedStation(station: Station): void {
        this.selectedStation = station;
    }

    // Sets the current station knowing the source
    setSelectedSource(source: string): void {

        // The list of stations is fetched again to search with the source
        // It was
        this.fetchStationList()
            .subscribe(data => {
                this.stationList = JSON.parse(JSON.stringify(data));
                this.loggerService.log('Stations refetched : '
                                       + this.stationList.length);

                this.setSelectedStation(this.findStation(source));
            },
                       error => {
                           this.messageService.display(error);
                       });
    }

    // Gets the current station
    getSelectedStation(): Station {
        return this.selectedStation;
    }

    // Finds the station object knowing the source
    private findStation(source: string): Station {
        if (source == null || undefined) {
            this.loggerService.log('No source to find !');
            return undefined;
        }
        else if (this.stationList.length < 1) {
            this.loggerService.log('Cannot find a station in an empty list !');
            return undefined;
        }

        const s: Station = this.stationList.find(
            station => station.stream === source);

        if (s === undefined) {
            this.loggerService.log('No station found yet !');
        }
        else {
            this.loggerService.log('Found : ' + s.name);
        }

        return s;
    }
}
