/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { PerformerEntity } from '../performer/performer.entity/performer.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerformerAlbumService } from './performer-album.service';

describe('PerformerAlbumService', () => {
    let service: PerformerAlbumService;
    let performerRepository: Repository<PerformerEntity>;
    let albumRepository: Repository<AlbumEntity>;
    let performer: PerformerEntity;
    let albumList: AlbumEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [PerformerAlbumService],
        }).compile();

        service = module.get<PerformerAlbumService>(PerformerAlbumService);
        performerRepository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
        albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
        await seedDatabase();
    });

    const seedDatabase = async () => {
        performerRepository.clear();
        albumRepository.clear();
        albumList = [];
        performer = await performerRepository.save({
            nombre: faker.person.firstName(),
            descripcion: faker.lorem.paragraph(),
            imagen: faker.image.url(),
        });

        await performerRepository.save(performer);

        for (let i = 0; i < 5; i++) {
            const album = await albumRepository.save({
                nombre: faker.person.firstName(),
                caratula: faker.image.url(),
                fechaLanzamiento: faker.date.past(),
                descripcion: faker.lorem.paragraph(),
                performers: [performer],
            });
            albumList.push(album);
        }
    };

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('addPerformerToAlbum should add a performer to an album', async () => {
        const performer2 = await performerRepository.save({
            nombre: faker.person.firstName(),
            descripcion: faker.lorem.paragraph(),
            imagen: faker.image.url(),
        });
        const album: AlbumEntity = albumList[0];
        const newPerformer = await service.addPerformerToAlbum(album.id, performer2.id);
        expect(newPerformer).not.toBeNull();

        const storedAlbum = await albumRepository.findOne({ where: { id: album.id }, relations: ['performers'] });
        expect(storedAlbum).not.toBeNull();
        expect(storedAlbum.performers).toHaveLength(2);
    });

    it('addPerformerToAlbum should throw an error if the album does not exist', async () => {
        await expect(() => service.addPerformerToAlbum('-1', performer.id)).rejects.toHaveProperty(
            'message',
            'The album with the given id was not found');        
    });

    it('addPerformerToAlbum should throw an error if the performer does not exist', async () => {
        const album: AlbumEntity = albumList[0];
        await expect(() => service.addPerformerToAlbum(album.id, '-1')).rejects.toHaveProperty(
            'message',
            'The performer with the given id was not found');        
    });

    it('addPerformerToAlbum should throw an error if the performer is already in the album', async () => {
        const album: AlbumEntity = albumList[0];
        await expect(() => service.addPerformerToAlbum(album.id, performer.id)).rejects.toHaveProperty(
            'message',
            'The album already has the performer associated');        
    });

    it('addPerformerToAlbum should throw an error if the album already has 3 performers', async () => {
        const album: AlbumEntity = albumList[0];
        const performer2 = await performerRepository.save({
            nombre: faker.person.firstName(),
            descripcion: faker.lorem.paragraph(),
            imagen: faker.image.url(),
        });
        const performer3 = await performerRepository.save({
            nombre: faker.person.firstName(),
            descripcion: faker.lorem.paragraph(),
            imagen: faker.image.url(),
        });
        const performer4 = await performerRepository.save({
            nombre: faker.person.firstName(),
            descripcion: faker.lorem.paragraph(),
            imagen: faker.image.url(),
        });
        await service.addPerformerToAlbum(album.id, performer2.id);
        await service.addPerformerToAlbum(album.id, performer3.id);
        await expect(() => service.addPerformerToAlbum(album.id, performer4.id)).rejects.toHaveProperty(
            'message',
            'The album has three performers associated');        
    });
});
