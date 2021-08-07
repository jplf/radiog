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

        return service.info(address).then(device => {
            expect(device.alias).toMatch('Headset');
        });
    });
    
    it('Headset device is trusted and paired', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.info(address).then(device => {
            expect(device.trusted).toBeTruthy();
            expect(device.paired).toBeTruthy();
        });
    });
    
    it('UE Boom device name is found', () => {
        
        let address: string = 'C0:28:8D:36:20:97';

        return service.info(address).then(device => {
            expect(device.name).toMatch("UE BOOM 2");
        });
    });
    
    it('Headset device not connected', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.info(address).then(device => {
            service.disconnect(device);
            expect(service.isConnected(device)).toBeFalsy();
        });
    });
    
    it('Headset device get connected', () => {
        
        let address: string = '00:09:A7:09:1B:AB';

        return service.info(address).then(device => {
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
    
    it('BT devices are found', () => {

        setTimeout(() => {
            let devices: Device[];
            devices = service.getBtDevices();
            expect(devices.length).toBeGreaterThan(1);
        }, 1000);
        
     });
    
    it('List of known devices loaded', () => {
        
        setTimeout(() => {
            service.loadBtDevices();
            expect(service.numberOfDevices()).toBeGreaterThan(1);
        }, 1000);
    });
    
    it('A known device may be found by alias', () => {

        setTimeout(() => {
            service.loadBtDevices();
            let device = service.findDeviceAka('Headset');
            expect(device.address).toMatch('00:09:A7:09:1B:AB');
        }, 1000);
    });

});
