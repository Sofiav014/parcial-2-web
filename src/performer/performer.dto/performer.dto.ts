/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';
export class PerformerDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsUrl()
    imagen: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    descripcion: string;
}
