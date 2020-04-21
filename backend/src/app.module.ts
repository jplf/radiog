import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerController } from './player/player.controller';
import { PlayerService } from './player/player.service';

@Module({
  imports: [],
  controllers: [AppController, PlayerController],
  providers: [AppService, PlayerService],
})
export class AppModule {}
