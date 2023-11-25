/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { PerformerEntity } from './performer.entity/performer.entity';

@Injectable()
export class PerformerService {
    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,
    ) {}

    async create(performer: PerformerEntity): Promise<PerformerEntity> {
        if (performer.descripcion.length > 100) {
            throw new BusinessLogicException("The description of the performer must be less than 100 characters", BusinessError.PRECONDITION_FAILED); 
        }
        return await this.performerRepository.save(performer);
    }

    async findOne(id: string): Promise<PerformerEntity> {
        const performer = await this.performerRepository.findOne({where: {id}, relations: ["albums"]});
        if (!performer) {
            throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
        }
        return performer;
    }

    async findAll(): Promise<PerformerEntity[]> {
        return await this.performerRepository.find({relations: ["albums"]});
    }

}

