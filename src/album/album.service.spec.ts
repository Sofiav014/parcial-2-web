/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AlbumEntity } from './album.entity/album.entity';
import { AlbumService } from './album.service';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumList: AlbumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
    repository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    albumList = [];
    for (let i = 0; i < 10; i++) {
      const album = repository.create({
        nombre: faker.person.firstName(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.paragraph(),
      });
      albumList.push(album);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an album', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      performers: [],
      tracks: [],
    };
    const newAlbum = await service.create(album);
    expect(newAlbum).not.toBeNull();

    const storedAlbum = await repository.findOne({ where: { id: newAlbum.id } });
    expect(storedAlbum).not.toBeNull();
    expect(storedAlbum.nombre).toEqual(album.nombre);
    expect(storedAlbum.caratula).toEqual(album.caratula);
    expect(storedAlbum.fechaLanzamiento).toEqual(album.fechaLanzamiento);
    expect(storedAlbum.descripcion).toEqual(album.descripcion);
  });

  it('should throw an error when the name of the album is not provided', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: "",
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
      performers: [],
      tracks: [],
    };
    await expect(service.create(album)).rejects.toHaveProperty("message", "The name of the album is required");
  });

  it('should throw an error when the description of the album is not provided', async () => {
    const album: AlbumEntity = {
      id: "",
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: "",
      performers: [],
      tracks: [],
    };
    await expect(service.create(album)).rejects.toHaveProperty("message", "The description of the album is required");
  });

  

});
