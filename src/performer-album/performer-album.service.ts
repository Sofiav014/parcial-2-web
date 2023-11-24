/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
@Injectable()
export class PerformerAlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,

        @InjectRepository(PerformerEntity)
        private performerRepository: Repository<PerformerEntity>,
    ) {}
    //Implemente
    // el método
    // add
    // PerformerToAlbum
    // (albumId
    // , performerId
    // )
    // el cual agrega un
    // performer a un álbum
    // .
    // Valide
    // que tanto el
    // performer
    // como el álbum existen. Un
    // álbum no
    // puede tener más de tres performers asociados

    async addPerformerToAlbum(albumId: string, performerId: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where: {id: albumId}, relations: ["performers"]});
        if (!album) {
            throw new BusinessLogicException("The album does not exist", BusinessError.NOT_FOUND);
        }
        const performer = await this.performerRepository.findOne({where: {id: performerId}});
        if (!performer) {
            throw new BusinessLogicException("The performer does not exist", BusinessError.NOT_FOUND);
        }
        if (album.performers.length >= 3) {
            throw new BusinessLogicException("The album has three performers associated", BusinessError.PRECONDITION_FAILED);
        }
        album.performers.push(performer);
        return await this.albumRepository.save(album);
    }

}
