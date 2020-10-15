import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('Device Controller', () => {
    let controller: DeviceController;
    let deviceService : DeviceService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DeviceController],
            providers: [DeviceService, ConfigService, Journal]
        }).compile();

        controller = module.get<DeviceController>(DeviceController);
        deviceService = module.get<DeviceService>(DeviceService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should give back the name', async () => {
        const result = "HP";
        jest.spyOn(deviceService, 'name').mockImplementation(() => result);
        expect(await controller.name()).toBe(JSON.stringify(result));
    });

    it('should return info', async () => {
        const result = {"wtf ?"};
        jest.spyOn(deviceService, 'info').mockImplementation(() => result);
        expect(await controller.info()).toBe(result);
    });
});
