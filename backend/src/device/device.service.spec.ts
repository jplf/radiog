import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
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
});
