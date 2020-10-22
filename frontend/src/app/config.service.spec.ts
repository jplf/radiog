import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { Config } from './config';


describe('ConfigService', () => {
    let service: ConfigService;


    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [ConfigService, HttpClient, HttpHandler]
        });

        service = TestBed.inject(ConfigService);

    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get the configuration', async () => {
        const version = "0.1";

        service.getConfig().subscribe(value => {

            expect(service.configuration).toBeTruthy();
        });
    });

});
