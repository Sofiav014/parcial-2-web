import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformerController } from './performer.controller';
import { PerformerEntity } from './performer.entity/performer.entity';
import { PerformerService } from './performer.service';
@Module({
  imports: [TypeOrmModule.forFeature([PerformerEntity])],
  providers: [PerformerService],
  controllers: [PerformerController],
})
export class PerformerModule {}
