/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TrackEntity } from './track.entity/track.entity';
import { TrackService } from './track.service';

describe('TrackService', () => {
  let service: TrackService;
  let trackRepository: Repository<TrackEntity>;
  let albumRepository: Repository<AlbumEntity>;
  let trackList: TrackEntity[];
  let album: AlbumEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TrackService],
    }).compile();

    service = module.get<TrackService>(TrackService);
    trackRepository = module.get<Repository<TrackEntity>>(getRepositoryToken(TrackEntity));
    albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    trackRepository.clear();
    albumRepository.clear();
    trackList = [];
    album = await albumRepository.save({
      nombre: faker.person.firstName(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.paragraph(),
    });

    await albumRepository.save(album);

    for (let i = 0; i < 5; i++) {
      const track = await trackRepository.save({
        nombre: faker.person.firstName(),
        duracion: faker.number.int({ min: 1 }),
        album: album,
      });
      trackList.push(track);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a track', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.person.firstName(),
      duracion: faker.number.int({ min: 1 }),
      album: album,
    };
    const newTrack = await service.create(album.id, track);
    expect(newTrack).not.toBeNull();

    const storedTrack = await trackRepository.findOne({ where: { id: newTrack.id } , relations:['album'] } );
    expect(storedTrack).not.toBeNull();
    expect(storedTrack.nombre).toEqual(track.nombre);
    expect(storedTrack.duracion).toEqual(track.duracion);
    expect(storedTrack.album).toEqual(track.album);
  });

  it('create should throw an error when the duration of the track is negative', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.person.firstName(),
      duracion: -2,
      album: album,
    };
    await expect(service.create(album.id, track)).rejects.toHaveProperty("message", "The duration of the track must be positive");
  });

  it('create should throw an error when the album does not exist', async () => {
    const track: TrackEntity = {
      id: "",
      nombre: faker.person.firstName(),
      duracion: faker.number.int({ min: 1 }),
      album: album,
    };
    await expect(service.create("-1", track)).rejects.toHaveProperty("message", "The album with the given id was not found");
  });

  it('findOne should return a track by id', async () => {
    const storedTrack: TrackEntity = trackList[0];
    const track: TrackEntity = await service.findOne(storedTrack.id);
    expect(track).not.toBeNull();
    expect(track.nombre).toEqual(storedTrack.nombre);
    expect(track.duracion).toEqual(storedTrack.duracion);
  });

  it('findOne should throw an exception for an invalid track', async () => {
    await expect(() => service.findOne('-1')).rejects.toHaveProperty(
      'message',
      'The track with the given id was not found',
    );
  });

  it('findAll should return all tracks', async () => {
    const tracks: TrackEntity[] = await service.findAll();
    expect(tracks).not.toBeNull();
    expect(tracks).toHaveLength(trackList.length);
  });

});
