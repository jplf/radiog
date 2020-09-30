import { Test, TestingModule } from '@nestjs/testing';
import { Journal } from './journal.service';

describe('JournalService', () => {
  let service: Journal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Journal],
    }).compile();

    service = module.get<Journal>(Journal);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
