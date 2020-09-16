import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { StationsService } from '../stations/stations.service';
import { ConfigService } from '@nestjs/config';
import { Journal } from '../journal/journal.service';

describe('Player Controller', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        controllers: [PlayerController],
        providers: [StationsService, PlayerService, ConfigService, Journal]
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
