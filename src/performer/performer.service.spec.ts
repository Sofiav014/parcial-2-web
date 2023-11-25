/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PerformerEntity } from './performer.entity/performer.entity';
import { PerformerService } from './performer.service';

describe('PerformerService', () => {
  let service: PerformerService;
  let repository: Repository<PerformerEntity>;
  let performerList: PerformerEntity[];
    

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerService],
    }).compile();

    service = module.get<PerformerService>(PerformerService);
    repository = module.get<Repository<PerformerEntity>>(getRepositoryToken(PerformerEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    performerList = [];
    for (let i = 0; i < 5; i++) {
      const performer = await repository.save({
        nombre: faker.person.firstName(),
        descripcion: faker.lorem.sentence({ min: 1, max: 3 }),
        imagen: faker.image.url(),
      });
      
      performerList.push(performer);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create a performer', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.person.firstName(),
      descripcion: faker.lorem.sentence({ min: 1, max: 3 }),
      imagen: faker.image.url(),
      albums: [],
    };
    const newPerformer = await service.create(performer);
    expect(newPerformer).not.toBeNull();

    const storedPerformer = await repository.findOne({ where: { id: newPerformer.id } });
    expect(storedPerformer).not.toBeNull();
    expect(storedPerformer.nombre).toEqual(performer.nombre);
    expect(storedPerformer.descripcion).toEqual(performer.descripcion);
  });

  it('create should throw an error if the description is more than 100 characters', async () => {
    const performer: PerformerEntity = {
      id: "",
      nombre: faker.person.firstName(),
      descripcion: faker.lorem.sentence(100),
      imagen: faker.image.url(),
      albums: [],
    };
    await expect(service.create(performer)).rejects.toHaveProperty( 'message', 'The description of the performer must be less than 100 characters' );
  });

  it('findOne should return a performer by id', async () => {
    const storedPerformer: PerformerEntity = performerList[0];
    const performer: PerformerEntity = await service.findOne(storedPerformer.id);
    expect(performer).not.toBeNull();
    expect(performer.nombre).toEqual(storedPerformer.nombre);
    expect(performer.descripcion).toEqual(storedPerformer.descripcion);
  });

  it('findOne should throw an exception for an invalid performer', async () => {
    await expect(() => service.findOne('-1')).rejects.toHaveProperty(
      'message',
      'The performer with the given id was not found',
    );
  });

  it('findAll should return all performers', async () => {
    const performers: PerformerEntity[] = await service.findAll();
    expect(performers).not.toBeNull();
    expect(performers).toHaveLength(performerList.length);
  });
});
