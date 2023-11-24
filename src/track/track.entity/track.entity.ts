/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AlbumEntity } from "../../album/album.entity/album.entity";

@Entity()
export class TrackEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;

    @Column()
    duracion: number;  
    
    // muchos TrackEntity tiene 1 AlbumEntity (compuesto por)
    @ManyToOne(() => AlbumEntity, (album) => album.tracks)
    album: AlbumEntity;
}
