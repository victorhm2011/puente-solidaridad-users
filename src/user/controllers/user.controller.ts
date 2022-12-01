import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, Request, Param, Patch, HttpException, Delete, NotFoundException, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { UserEntryDto } from '../dto/userEntry.dto';
import { UserService } from '../services/user.service';
import { User } from '../models/user.interface';
import { JwtService } from '@nestjs/jwt';
import { from, map, Observable } from 'rxjs';
import { JwtGuard } from '../guards/jwt.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '../models/role.enum';
import { UserExitDto } from '../dto/userExit.dto';
import { UserPatchDto } from '../dto/userPatch.dto';
import { errors } from '../constants/constants';


@Controller({version: '1'})
export class UserController {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    @Roles(Role.ADMIN)
    @Post('user')
    register2(@Body() user: UserEntryDto): Observable<User> {
        return this.userService.registerUser(user);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login2(@Body() user: User): Observable<{ token: string }> {
        const token = this.userService
        .login(user)
        .pipe(map((jwt: string) => ({ token: jwt })));
        if(token == undefined) {
            throw new BadRequestException(errors.credentials);
        }
        return token;
    }
    
    @UseGuards(JwtGuard)
    @Get('user')
    async user(@Request() req) {
        const user = await this.userService.findOne(req.user.id);
        const {password, ...result} = user;
        return result;
    }

    @UseGuards(JwtGuard)
    @Get('user/:id')
    async getUserByEmail(@Param('id', new ParseUUIDPipe()) id: string) {
        const user = await this.userService.findOne(id);
        if(!user){
            throw new NotFoundException(errors.exist);
        }
        const {password, ...result} = user;
        return result;
    }

    @UseGuards(JwtGuard)
    @Get('users')
    async findAll(): Promise<UserExitDto[]> {
        return await this.userService.getUserList();
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Patch('user/:email')
    async update(
        @Param('email') email: string,
        @Body() user: UserPatchDto,
    ): Promise<User> {
        const userToUpdate = await this.userService.findOneUser(email);
        if(!userToUpdate){
            throw new NotFoundException(errors.exist);
        }
        await this.userService.updateUser(email, user);
        const userUpdated = await this.userService.findOneUser(email);
        const {password, ...result} = userUpdated;
        return result;
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtGuard, RolesGuard)
    @Delete('user/:id')
    async delete(@Param('id') id: string): Promise<UserExitDto> {
        const userToDelete = await this.userService.findOne(id);
        if(!userToDelete){
            throw new NotFoundException(errors.exist);
        }
        await this.userService.deleteUser(id);
        throw new HttpException(errors.removed, errors.noContent);
    }
}
