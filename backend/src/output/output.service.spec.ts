/**
 * Testing the output service
 * To check only this service run :
 * npm test -- --silent=false output/output.service.spec.ts
 * To check only one method change it() to it.only()
 */
import { Test, TestingModule } from '@nestjs/testing';
import { OutputService } from './output.service';
import { DeviceService } from '../device/device.service';
import { Device } from '../device/device.interface';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('OutputService', () => {
    let output: OutputService;
    let devices: DeviceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: [process.env.RADIOG_CONF,
                                  process.env.RADIOG_HOME
                                  + '/etc/radiog.conf']
                })
            ],
            providers: [OutputService, DeviceService, ConfigService, Journal]
            
        }).compile();

        output  = module.get<OutputService>(OutputService);
        devices = module.get<DeviceService>(DeviceService);
    });

    it('should be defined', () => {
        expect(output).toBeDefined();
    });

    it('output device should be defined', () => {
        expect(output.getDevice()).toBeDefined();
    });
    
    it('output device name should be defined', () => {
        let device = output.getDevice();
        expect(device.name).toBeDefined();
    });
    
    it('output device can be set', async () => {
        
        return devices.loadBtDevices().then(nbr => {
            output.setDeviceAka('BOOM VLF');
            expect(output.name()).toMatch('UE BOOM 2');
        });
    });

});
/*------------------------------------------------------------------------*/
