/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PerformerEntity } from "../../performer/performer.entity/performer.entity";
import { TrackEntity } from "../../track/track.entity/track.entity";
@Entity()
export class AlbumEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    nombre: string;

    @Column()
    caratula: string;

    @Column()
    fechaLanzamiento: Date;

    @Column()
    descripcion: string;

    // muchos AlbumEntity tiene 0..3 performerEntity
    @ManyToMany(() => PerformerEntity, (performer) => performer.albums)
    performers: PerformerEntity[];

    // 1 AlbumEntity tiene muchos TrackEntity (compuesto por)
    @OneToMany(() => TrackEntity, (track) => track.album)
    tracks: TrackEntity[];
}
