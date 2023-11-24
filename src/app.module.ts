/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'parcial2',
      entities: [], //TODO: add entities
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    //TODO: add modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
