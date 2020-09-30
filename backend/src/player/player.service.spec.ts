import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PlayerService } from './player.service';
import { Player } from './player.interface';
import { Journal } from '../journal/journal.service';

describe('PlayerService', () => {
    let service: PlayerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PlayerService, ConfigService, Journal],
        }).compile();

        service = module.get<PlayerService>(PlayerService);
    });

    it('player service should be defined', () => {
        expect(service).toBeDefined();
    });
    
    it('player should be defined', () => {
        var player = service.getPlayer();
        expect(player).toBeDefined();
    });
    
});
