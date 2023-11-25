/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PerformerDto } from './performer.dto/performer.dto';
import { PerformerEntity } from './performer.entity/performer.entity';
import { PerformerService } from './performer.service';

@Controller('performers')
@UseInterceptors(BusinessErrorsInterceptor)
export class PerformerController {
    constructor(private readonly performerService: PerformerService) {}

    @Post()
    async create(@Body() performerDto: PerformerDto) {
        const performer: PerformerEntity  = plainToInstance(PerformerEntity, performerDto);
        return plainToInstance(PerformerDto, await this.performerService.create(performer));
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.performerService.findOne(id);
    }

    @Get()
    async findAll() {
        return await this.performerService.findAll();
    }
}
