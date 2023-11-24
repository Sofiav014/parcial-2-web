/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/album/album.entity/album.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { TrackEntity } from './track.entity/track.entity';

@Injectable()
export class TrackService {
    constructor(
        @InjectRepository(TrackEntity)
        private trackRepository: Repository<TrackEntity>,

        @InjectRepository(AlbumEntity)
        private albumRepository: Repository<AlbumEntity>,
    ) {}

    async create(albumId: string, track: TrackEntity): Promise<TrackEntity> {
        if (track.duracion < 0) {
            throw new BusinessLogicException("The duration of the track must be positive", BusinessError.PRECONDITION_FAILED); 
        }
        const album = await this.albumRepository.findOne({where: {id: albumId}});
        if (!album) {
            throw new BusinessLogicException("The album does not exist", BusinessError.NOT_FOUND);
        }
        track.album = album;
        return await this.trackRepository.save(track);
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track = await this.trackRepository.findOne({where: {id}, relations: ["album"]});
        if (!track) {
            throw new BusinessLogicException("The track does not exist", BusinessError.NOT_FOUND);
        }
        return track;
    }

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({relations: ["album"]});
    }

    // async delete(id: string): Promise<void> {
    //     const track = await this.trackRepository.findOne({where: {id}});
    //     if (!track) {
    //         throw new BusinessLogicException("The track does not exist", BusinessError.NOT_FOUND);
    //     }
    //     await this.trackRepository.delete(id);
    // }
}
