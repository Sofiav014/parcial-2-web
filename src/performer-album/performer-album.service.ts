/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
@Injectable()
export class PerformerAlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,

        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>,
    ) {}

    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where: {id: albumId}, relations: ["performers"]});
        if (!album) {
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        }
        const performer = await this.performerRepository.findOne({where: {id: performerId}});
        if (!performer) {
            throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
        }

        const performerAlbum = album.performers.find(performerAlbum => performerAlbum.id === performer.id);
        if (performerAlbum) {
            throw new BusinessLogicException("The album already has the performer associated", BusinessError.BAD_REQUEST);
        }

        if (album.performers.length >= 3) {
            throw new BusinessLogicException("The album has three performers associated", BusinessError.PRECONDITION_FAILED);
        }
        album.performers = [...album.performers, performer];
        return await this.albumRepository.save(album);
    }

}
