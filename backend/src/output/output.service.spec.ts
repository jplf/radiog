import { Test, TestingModule } from '@nestjs/testing';
import { OutputService } from './output.service';
import { DeviceService } from '../device/device.service';
import { Device } from '../device/device.interface';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('OutputService', () => {
    let service: OutputService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: [process.env.RADIOG_CONF,
                                  process.env.RADIOG_HOME + '/etc/radiog.conf']
                })
            ],
            providers: [OutputService, DeviceService, ConfigService, Journal]
            
        }).compile();

        service = module.get<OutputService>(OutputService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    it('device should be defined', () => {
        expect(service.getDevice()).toBeDefined();
    });
    
    it('device should be defined', () => {
        expect(service.getDevice()).toBeDefined();
    });
    
    it('device name should be defined', () => {
        let device = service.getDevice();
        expect(device.name).toBeDefined();
    });
});
