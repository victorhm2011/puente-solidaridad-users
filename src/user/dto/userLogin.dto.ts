import { IsOptional, IsString, MaxLength } from "class-validator";

export class UserLoginDto {
    
    @MaxLength(1000)
    @IsString()
    email: string;

    @MaxLength(50)
    @IsString()
    password: string;
}