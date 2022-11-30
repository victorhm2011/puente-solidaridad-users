import { IsDateString, IsString, MaxLength } from "class-validator";
import { Role } from "../models/role.enum";

export class UserEntryDto {
    
    @MaxLength(1000)
    @IsString()
    name: string;

    @MaxLength(1000)
    @IsString()
    firstLastName: string;

    @MaxLength(1000)
    @IsString()
    secondLastName: string;

    @IsDateString()
    dateOfBirth: Date;

    @MaxLength(1000)
    @IsString()
    email: string;

    @MaxLength(50)
    @IsString()
    password: string;

    @IsString()
    role: Role;
}
