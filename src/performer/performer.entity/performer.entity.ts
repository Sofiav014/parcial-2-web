/* eslint-disable prettier/prettier */
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { AlbumEntity } from "../../album/album.entity/album.entity";
@Entity()
export class PerformerEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;

    @Column()
    imagen: string;

    @Column()
    descripcion: string;

    // 0..3 PerformerEntity tiene muchos AlbumEntity
    @ManyToMany(() => AlbumEntity, (album) => album.performers)
    @JoinTable()
    albums: AlbumEntity[];
}
