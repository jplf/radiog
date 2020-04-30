import { Injectable } from '@angular/core';
import { Station } from './station';
import { MessageService } from '../messages/message.service';
import { LoggerService }  from '../messages/logger.service';

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse }  from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class StationService {

    constructor(private messageService: MessageService,
                private loggerService: LoggerService,
                private http: HttpClient) {}

    fetchStationList() {
        
        return this.http.get('http://localhost:18300/player/station-list',
                             {
                                 headers: {'Access-Control-Allow-Origin': '*'},
                                 observe: 'body',
                                 responseType: 'json'
                             })
            .pipe(catchError(this.handleError));
    }
    
    private handleError(error: HttpErrorResponse) {
        
        if (error.error instanceof ErrorEvent) {
            this.loggerService.log('Client error: ' + error.error.message);
        } else {
            console.log(`Backend error ${error.status} ${error.message}`);
        }
        
        return throwError('WTF ?');
    };

    getStationList(): Station[] {
        
        return null;
    }
}
