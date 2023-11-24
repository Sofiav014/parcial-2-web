/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from './album.entity/album.entity';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,
    ) {}
    
    async create(album: AlbumEntity): Promise<AlbumEntity> {
        if (!album.nombre) {
            throw new BusinessLogicException("The name of the album is required", BusinessError.PRECONDITION_FAILED); 
        }
        if (!album.descripcion) {
            throw new BusinessLogicException("The description of the album is required", BusinessError.PRECONDITION_FAILED); 
        }
        return await this.albumRepository.save(album);
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where: {id}, relations: ["tracks", "performers"]});
        if (!album) {
            throw new BusinessLogicException("The album does not exist", BusinessError.NOT_FOUND);
        }
        return album;
    }

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({relations: ["tracks", "performers"]});
    }

    async delete(id: string): Promise<void> {
        const album = await this.albumRepository.findOne({where: {id}, relations: ["tracks"]});
        if (!album) {
            throw new BusinessLogicException("The album does not exist", BusinessError.NOT_FOUND);
        }
        if (album.tracks.length > 0) {
            throw new BusinessLogicException("The album has tracks associated", BusinessError.PRECONDITION_FAILED);
        }
        await this.albumRepository.delete(id);
    }
}
