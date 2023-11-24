import { Module } from '@nestjs/common';
import { PerformerService } from './performer.service';
import { PerformerController } from './performer.controller';

@Module({
  providers: [PerformerService],
  controllers: [PerformerController]
})
export class PerformerModule {}
