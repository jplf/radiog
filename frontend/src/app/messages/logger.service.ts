import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

export class LoggerService {

    constructor(private datePipe: DatePipe) {}

    log(msg: any) {
        var d = this.datePipe.transform(new Date(), 'dd/MM HH:mm:ss')
        console.log(d + " " + JSON.stringify(msg));
    }
}

