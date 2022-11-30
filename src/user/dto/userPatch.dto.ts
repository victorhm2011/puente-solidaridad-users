import { IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class UserPatchDto {
    
    @IsOptional()
    @MaxLength(1000)
    @IsString()
    name: string;

    @IsOptional()
    @MaxLength(1000)
    @IsString()
    firstLastName: string;

    @IsOptional()
    @MaxLength(1000)
    @IsString()
    secondLastName: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth: Date;

    @IsOptional()
    @MaxLength(50)
    @IsString()
    password: string;
}