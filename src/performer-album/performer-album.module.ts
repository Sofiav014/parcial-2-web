import { Module } from '@nestjs/common';
import { PerformerAlbumController } from './performer-album.controller';
import { PerformerAlbumService } from './performer-album.service';

@Module({
  providers: [PerformerAlbumService],
  controllers: [PerformerAlbumController],
})
export class PerformerAlbumModule {}
