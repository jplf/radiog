import { Test, TestingModule } from '@nestjs/testing';
import { OutputController } from './output.controller';
import { DeviceService } from '../device/device.service';
import { OutputService } from './output.service';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('OutputController', () => {
  let controller: OutputController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [OutputController],
        providers: [OutputService, DeviceService, ConfigService, Journal]

    }).compile();

    controller = module.get<OutputController>(OutputController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
