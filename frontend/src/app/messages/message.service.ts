import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * This service display messages on the web page.
 */
export class MessageService {

    message = 'Enjoy RadioG !';

    display(message: string) {
        this.message = message;
    }

    clear() {
        this.message = '';
    }
}
