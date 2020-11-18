import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Config } from './config';


// ng test --test-path-pattern="config.service.spec.ts"
// It was a nightmare to call loadConfig() and make the tests working.
// Instead a plain test configuration is stored in the config service.


describe('ConfigService', () => {

    let service: ConfigService;

    const testConfiguration: Config = {
        version: 'Test 0.1',
        playerUrl: 'http://localhost:18300/player/',
        stationKey: '12',
        volume: 10
    };

    beforeAll(() => {
        TestBed.configureTestingModule({
            providers: [ConfigService],
            imports: [HttpClientModule]
        });

        service = TestBed.inject(ConfigService);
        console.log('Before all');

        service.configuration = testConfiguration;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        console.log('Config truthy');
    });

    it('should not get a wrong version number', () => {

        const version = '0.19999999';

        expect(service.version).not.toBe(version);
    });

    it('should get the correct version number', () => {

        const version = testConfiguration.version;

        expect(service.version).toBe(version);
    });

    it('should get the player url', () => {

        const url = testConfiguration.playerUrl;

        expect(service.playerUrl).toBe(url);
    });

    afterAll(() => {
        console.log('All done');
    });
});
