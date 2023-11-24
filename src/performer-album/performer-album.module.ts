import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { PerformerAlbumController } from './performer-album.controller';
import { PerformerAlbumService } from './performer-album.service';
@Module({
  imports: [TypeOrmModule.forFeature([PerformerEntity, AlbumEntity])],
  providers: [PerformerAlbumService],
  controllers: [PerformerAlbumController],
})
export class PerformerAlbumModule {}
