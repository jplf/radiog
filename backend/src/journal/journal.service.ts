import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class Journal extends Logger {
    
  log(message: string) {
    // add your tailored logic here
    super.log(message, 'RadioG');
  }
}

