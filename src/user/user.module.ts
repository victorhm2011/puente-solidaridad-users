import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { UserEntity } from './models/user.entity';
import { UserService } from './services/user.service';
import * as fs from 'fs'

const privateKey = fs.readFileSync('private.pem', 'utf8');
const publicKey = fs.readFileSync('public.pem', 'utf8');

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.registerAsync({
          useFactory: () => ({
            privateKey: privateKey,
            publicKey: publicKey,
            signOptions: { expiresIn: '3600s', algorithm: 'RS256' },
          }),
        }),
      ],
      providers: [UserService, JwtGuard, JwtStrategy, RolesGuard],
      controllers: [UserController]
})
export class UserModule {}
