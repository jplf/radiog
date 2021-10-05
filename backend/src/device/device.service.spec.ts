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
    
    it('Headset device alias is found', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.makeDevice(address).then(device => {
            expect(device.alias).toMatch('Headset');
        });
    });
    
    it('Headset device is trusted and paired', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.makeDevice(address).then(device => {
            expect(device.trusted).toBeTruthy();
            expect(device.paired).toBeTruthy();
        });
    });
    
    it('UE Boom device name is found', () => {
        
        let address: string = 'C0:28:8D:36:20:97';

        return service.makeDevice(address).then(device => {
            expect(device.name).toMatch("UE BOOM 2");
        });
    });
    
    it('Headset device not connected', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.makeDevice(address).then(device => {
            service.disconnect(device);
            expect(service.isConnected(device)).toBeFalsy();
        });
    });
    
    it('Headset device get connected', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.makeDevice(address).then(device => {
            service.connect(device);
            expect(service.isConnected(device)).toBeTruthy();
        });
    });
    
    it('A device can be fully created', () => {
        
        const line: string = 'w0 w1 Device C0:28:8D:36:20:97 BOOM VLF';

        return service.createDevice(line).then(device => {
            expect(device.name).toMatch("UE BOOM 2");
        });
    });
    
    it('BT devices are found', async () => {
        
        // npm test -- --silent=false device/device.service.spec.ts
        
            return service.findBtDevices().then(devices => {
                expect(devices.length).toBeGreaterThan(1);
            });
    });
    
    // npm test -- --silent=false device/device.service.spec.ts
    it('List of known devices loaded', async () => {
        
        return service.loadBtDevices().then(nbr => {
            console.log(nbr);
            expect(nbr).toBeGreaterThan(1);
        });
    });
    
    it('A known device may be found by alias', () => {

        service.loadBtDevices();
        let device = service.findDeviceAka('Headset');
        expect(device.address).toMatch('00:09:A7:09:1B:AB');
    });

});
/*------------------------------------------------------------------------*/
