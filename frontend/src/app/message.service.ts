import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
    
    message: string = 'Enjoy RadioG !';

    display(message: string) {
        this.message = message;
    }

    clear() {
        this.message = '';
    }
}
