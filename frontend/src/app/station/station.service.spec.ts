import { TestBed } from '@angular/core/testing';
import { StationService } from './station.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

describe('StationService', () => {

    let service: StationService;

    beforeEach(async () => {
        TestBed.configureTestingModule({

            providers: [StationService, DatePipe, HttpClient, HttpHandler]
        });

        service = TestBed.inject(StationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
