import { Test, TestingModule } from '@nestjs/testing';
import { OutputService } from './output.service';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('OutputService', () => {
  let service: OutputService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OutputService, ConfigService, Journal],
    }).compile();

    service = module.get<OutputService>(OutputService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
