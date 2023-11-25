/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { TrackEntity } from '../track/track.entity/track.entity';
import { AlbumEntity } from './album.entity/album.entity';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,

        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>,
    ) {}
    
    async create(album: AlbumEntity): Promise<AlbumEntity> {
        if (!album.nombre || album.nombre.length < 1) {
            throw new BusinessLogicException("The name of the album is required", BusinessError.PRECONDITION_FAILED); 
        }
        if (!album.descripcion || album.descripcion.length < 1) {
            throw new BusinessLogicException("The description of the album is required", BusinessError.PRECONDITION_FAILED); 
        }
        return await this.albumRepository.save(album);
    }

    async findOne(id: string): Promise<AlbumEntity> {
        const album = await this.albumRepository.findOne({where: {id}, relations: ["tracks", "performers"]});
        if (!album) {
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        }
        return album;
    }

    async findAll(): Promise<AlbumEntity[]> {
        return await this.albumRepository.find({relations: ["tracks", "performers"]});
    }

    async delete(id: string): Promise<void> {
        const album = await this.albumRepository.findOne({where: {id}, relations: ["tracks"]});
        if (!album) {
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        }
        if (album.tracks.length > 0) {
            throw new BusinessLogicException("The album has tracks associated", BusinessError.PRECONDITION_FAILED);
        }
        await this.albumRepository.delete(id);
    }

    async addTrackToAlbum(albumId: string, trackId: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: albumId}, relations: ["tracks"]});
        if (!album) {
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        }
        const track: TrackEntity = await this.trackRepository.findOne({where: {id: trackId}});
        if (!track) {
            throw new BusinessLogicException("The track with the given id was not found", BusinessError.NOT_FOUND);
        }

        const trackAlbum = album.tracks.find(trackAlbum => trackAlbum.id === track.id);
        if (trackAlbum) {
            throw new BusinessLogicException("The album already has the track associated", BusinessError.BAD_REQUEST);
        }

        album.tracks = [...album.tracks, track];
        return await this.albumRepository.save(album);
    }
}