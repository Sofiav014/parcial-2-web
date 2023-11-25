/* eslint-disable prettier/prettier */
import { IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class AlbumDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsUrl()
    caratula: string;

    @IsNotEmpty()
    @IsDateString()
    fechaLanzamiento: Date;

    @IsNotEmpty()
    @IsString()
    descripcion: string;
}
