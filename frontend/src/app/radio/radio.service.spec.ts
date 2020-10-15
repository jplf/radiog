import { TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

import { RadioService } from './radio.service';

describe('RadioService', () => {
    
    let service: RadioService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RadioService, DatePipe, HttpClient, HttpHandler]
        });
        
        service = TestBed.inject(RadioService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
