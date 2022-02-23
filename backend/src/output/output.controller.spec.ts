import { Logger, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OutputController } from './output.controller';
import { DeviceService } from '../device/device.service';
import { OutputService } from './output.service';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';


describe('OutputController', () => {
    let output: OutputController;
    let service: OutputService;
    let config: ConfigService;
    

    // let app: INestApplication;
    // 
        
    //app = module.createNestApplication();
    //await app.init();
    
    class ConfigServiceMock {

         params = new Map<string, string>([
            ["COMMAND", "play.sh"],
            ["BACKEND_PORT", "3000"],
            ["VOLUME", "20"],
            ["DEV_NAME", "LOUD_SPEAKER"],
            ["STATION_LIST", "etc/stations.json"]
        ]);
        
        get(key: string) : string {
            return this.params.get(key);
        }
    }
    
    beforeAll(async () => {
        
        const ConfigServiceProvider = {
            provide: ConfigService,
            useClass: ConfigServiceMock,
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [OutputController],
            providers: [OutputService, DeviceService, Journal,
                        ConfigServiceProvider]

        }).compile();
        
        config = module.get<ConfigService>(ConfigService);
        output = module.get<OutputController>(OutputController);
        service = module.get<OutputService>(OutputService);
    });

    it('should be defined', async () => {
        expect(output).toBeDefined();
    });
    
    it('should give back the name', async () => {
        const result = 'LOUD_SPEAKER';
        const device = config.get<string>('DEV_NAME');
        jest.spyOn(service, 'name').mockImplementation(() => result);
        expect(await output.name()).toBe(JSON.stringify(device));
    });

});
