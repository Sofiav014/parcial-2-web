import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackEntity } from '../track/track.entity/track.entity';
import { AlbumController } from './album.controller';
import { AlbumEntity } from './album.entity/album.entity';
import { AlbumService } from './album.service';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity, TrackEntity])],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
