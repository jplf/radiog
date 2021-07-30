import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { Device } from './device.interface';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('DeviceService', () => {
    let service: DeviceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DeviceService, ConfigService, Journal],
        }).compile();

        service = module.get<DeviceService>(DeviceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    
    it('BT controller is found', () => {

        let btCtrl = service.getBtController();
        expect(btCtrl).toMatch(/Controller/);
     });
    
    it('BT devices are found', () => {

        let devices = service.getBtDevices();
        expect(devices.length).toBeGreaterThan(1);
    });
    
    it('Headset device is found', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.info(address).then(device => {
            console.log(device.name);
            expect(device.alias).toMatch("Headset");
        });
    });
});
