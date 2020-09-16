import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { StationsService } from './stations.service';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';
import { Station } from './station.interface';

describe('StationsService', () => {
    let service: StationsService;
    let config: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: process.env.RADIOG_CONF
                })
            ],
            providers: [StationsService, ConfigService, Journal]
        }).compile();

        service = module.get<StationsService>(StationsService);
        config  = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    it('path to stations should be valid', () => {
        var path = config.get<string>('RADIOG_HOME') + '/'
            + config.get<string>('STATION_LIST');
        
        expect(path).toMatch(/stations.json/);
    });
    
    it('stations are loaded', () => {
        return service.load().then(list => {
            expect(list.length).toBeGreaterThan(1);
        });
    });
    
});
