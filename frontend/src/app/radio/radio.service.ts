import { Injectable } from '@angular/core';
import { LoggerService }  from '../messages/logger.service';
import { MessageService } from '../messages/message.service';
import { ConfigService } from '../config.service';

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse }  from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/**
 * Manages interactions with the backend service.
 */
export class RadioService {
    
    constructor(private loggerService: LoggerService,
                private messageService: MessageService,
                private configService: ConfigService,
                private http: HttpClient) {
    }

    switchOnOff(status : boolean, key: string) {
        
        var url = this.configService.playerUrl;
        this.loggerService.log('Request to switch ' + status);
        
        if (status) {
            url = url + 'listen/' + key;
        }
        else {
            url = url + 'off';
        }
        
        return this.http.get(url).pipe(catchError(this.handleError));
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
    
    // Changes the output volume
    setVolume(value: number) {
        
        var volume : string = value.toString();
        
        var url = this.configService.playerUrl;
        
        this.loggerService.log('Request to set volume to ' + volume);
        
        url = url + 'set?volume=' + volume;
        
        return this.http.get(url).pipe(catchError(this.handleError));
    }
    
    // Fetchs the player status from the backend
    fetchPlayer() {
        
        var url = this.configService.playerUrl;
        
        this.loggerService.log('Request the player status');
        
        return this.http.get(url).pipe(catchError(this.handleError));
    }
}
