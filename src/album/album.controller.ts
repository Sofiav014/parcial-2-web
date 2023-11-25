/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AlbumDto } from './album.dto/album.dto';
import { AlbumEntity } from './album.entity/album.entity';
import { AlbumService } from './album.service';

@Controller('albums')
@UseInterceptors(BusinessErrorsInterceptor)
export class AlbumController {
    constructor(private readonly albumService: AlbumService) {}

    @Post()
    async create(@Body() albumDto: AlbumDto) {
        const album: AlbumEntity  = plainToInstance(AlbumEntity, albumDto);
        return plainToInstance(AlbumDto, await this.albumService.create(album));
    }

    @Put(':albumId/tracks/:trackId')
    async addTrackToAlbum(@Param('albumId') albumId: string, @Param('trackId') trackId: string) {
        return await this.albumService.addTrackToAlbum(albumId, trackId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.albumService.findOne(id);
    }

    @Get()
    async findAll() {
        return await this.albumService.findAll();
    }

    @Delete(':id')
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        await this.albumService.delete(id);
    }
}
