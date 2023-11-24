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
        performer = performerRepository.create({
            nombre: faker.person.firstName(),
            descripcion: faker.lorem.paragraph(),
            imagen: faker.image.url(),
        });

        await performerRepository.save(performer);

        for (let i = 0; i < 5; i++) {
            const album = albumRepository.create({
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
});
