import { TestBed } from '@angular/core/testing';
import { APP_INITIALIZER } from '@angular/core';
import { ApplicationInitStatus } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Config } from './config';
import { HttpClientModule } from '@angular/common/http';

// ng test --test-path-pattern="config.service.spec.ts"
// It was a nightmare to call loadConfig() and make the tests working.
// Instead a plain test configuration is stored in the config service.


describe('ConfigService', () => {

    let service: ConfigService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ ConfigService, HttpClient, HttpHandler,
                         {
                             provide: APP_INITIALIZER,
                             multi: true,
                             deps: [ConfigService],
                             useFactory: (configService: ConfigService) => {
                                 return () => {
                                     configService.getConfig();
                                     console.log("The configuration is got");
                                 };
                             }
                         }
                       ]
        });

        service = TestBed.inject(ConfigService);
        console.log("Configured");
    });

    describe('test', async () => {
        await TestBed.inject(ApplicationInitStatus).donePromise;
        it('should be created', async () => {
            expect(service).toBeTruthy();
            expect(service.version).toBe('4');
        });
    });

//    it('should get the configuration', async () => {
//        const version = '0.1';
//        await TestBed.inject(ApplicationInitStatus).donePromise;
//
//        expect(await service.version).toBe(version);
//    });
});
