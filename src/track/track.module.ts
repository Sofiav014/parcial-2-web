import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/album/album.entity/album.entity';
import { TrackController } from './track.controller';
import { TrackEntity } from './track.entity/track.entity';
import { TrackService } from './track.service';

@Module({
  imports: [TypeOrmModule.forFeature([TrackEntity, AlbumEntity])],
  providers: [TrackService],
  controllers: [TrackController],
})
export class TrackModule {}
