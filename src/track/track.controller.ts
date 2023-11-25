/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TrackDto } from './track.dto/track.dto';
import { TrackEntity } from './track.entity/track.entity';
import { TrackService } from './track.service';

@Controller('tracks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TrackController {
    constructor(
        private readonly trackService: TrackService,
    ) {}

    @Post(':albumId')
    async create(@Param('albumId') albumId: string, @Body() trackDto: TrackDto) {
        const track: TrackEntity  = plainToInstance(TrackEntity, trackDto);
        return plainToInstance(TrackDto, await this.trackService.create(albumId, track));
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.trackService.findOne(id);
    }

    @Get()
    async findAll() {
        return await this.trackService.findAll();
    }
}
