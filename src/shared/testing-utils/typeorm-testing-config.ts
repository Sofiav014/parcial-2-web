/* eslint-disable prettier/prettier */
// import { NotificationEntity } from '../../notification/notification.entity/notification.entity';
// import { UserEntity } from '../../user/user.entity/user.entity';
// import { GameEntity } from '../../game/game.entity/game.entity';
// import { GenreEntity } from '../../genre/genre.entity/genre.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    //TODO: complete with entities
    entities: [],
    // entities: [GameEntity, UserEntity, GenreEntity, NotificationEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  //TODO: complete with entities
  TypeOrmModule.forFeature([]),
  // TypeOrmModule.forFeature([GameEntity, UserEntity, GenreEntity, NotificationEntity]),
 ];
