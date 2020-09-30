import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('Device Controller', () => {
    let controller: DeviceController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DeviceController],
            providers: [DeviceService, ConfigService, Journal]
        }).compile();

        controller = module.get<DeviceController>(DeviceController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
