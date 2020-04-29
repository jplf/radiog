import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class Journal extends Logger {
    
  log(message: string) {
    // Inserts the RadioG tag
    super.log(message, 'RadioG');
  }
}

