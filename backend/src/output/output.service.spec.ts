import { Test, TestingModule } from '@nestjs/testing';
import { OutputService } from './output.service';
import { DeviceService } from '../device/device.service';
import { Device } from '../device/device.interface';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('OutputService', () => {
    let output: OutputService;

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

        output = module.get<OutputService>(OutputService);
    });

    it('should be defined', () => {
        expect(output).toBeDefined();
    });

    it('output device should be defined', () => {
        expect(output.getDevice()).toBeDefined();
    });
    
    it('output device can be set', () => {
        output.setDeviceAka('BOOM VLF');
        expect(output.name()).toMatch('UE BOOM 2');
    });
    
    it('output device name should be defined', async () => {
        let device = await output.getDevice();
        expect(device.name).toBeDefined();
    });

});
