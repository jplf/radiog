import { TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {

    let service: LoggerService;
    // The array keeping track of the output
    let outputStack = [];

    const theLog = console.log;

    // Resets the original log method
    afterEach(() => (console.log = theLog));

    beforeEach(() => {

        // Empties the stack
        outputStack = [];
        // Inserts the message into the stack
        const mockedLog = msg => outputStack.push(msg);

        console.log = mockedLog;

        TestBed.configureTestingModule({
            providers: [DatePipe]
        });

        service = TestBed.inject(LoggerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should log message', () => {
        const msg = 'bravo JP !';
        service.log(msg);
        expect(outputStack[0]).toMatch(msg);
    });

});
