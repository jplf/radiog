/**
 * The journal utility.
 * It customizes the logging.
 */

import { Injectable } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common';

// Mainly used to learn  NestJs
@Injectable()
export class Journal extends ConsoleLogger {
    
  log(message: string) {
    // Inserts the RadioG tag
    super.log(message, 'RadioG');
  }
}
/*------------------------------------------------------------------------*/
