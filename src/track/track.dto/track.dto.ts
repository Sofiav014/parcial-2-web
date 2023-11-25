/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Min } from 'class-validator';
export class TrackDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @Min(0)
    duracion: number;
}
