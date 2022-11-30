import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserExitDto } from '../dto/userExit.dto';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import * as bcrypt from 'bcrypt';
import { map, switchMap } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {}

    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerUser(user: User): Observable<User> {
        const { name, firstLastName, secondLastName, dateOfBirth, email, password, role } = user;
        return this.hashPassword(password).pipe(
            switchMap(() => {
                return this.hashPassword(password).pipe(
                  switchMap((hashedPassword: string) => {
                    return from(
                      this.userRepository.save({
                        name, firstLastName, secondLastName, dateOfBirth, email, password: hashedPassword, role
                      }),
                    ).pipe(
                      map((user: User) => {
                        delete user.password;
                        return user;
                      }),
                    );
                }),
            );}),
        );
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(
          this.userRepository.findOne(
            { email }
          ),
        ).pipe(
          switchMap((user: User) => {
            if (!user) {
              throw new HttpException(
                { status: HttpStatus.FORBIDDEN, error: 'Invalid Credentials' },
                HttpStatus.FORBIDDEN,
              );
            }
            return from(bcrypt.compare(password, user.password)).pipe(
              map((isValidPassword: boolean) => {
                if (isValidPassword) {
                  delete user.password;
                  return user;
                }
              }),
            );
          }),
        );
    }

    login(user: User): Observable<string> {
        const { email, password } = user;
        return this.validateUser(email, password).pipe(
          switchMap((user: User) => {
            if (user) {
              // create JWT - credentials
              return from(this.jwtService.signAsync({ user }));
            }
          }),
        );
      }

    async create(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    async findOneUser(email: string): Promise<User> {
        return this.userRepository.findOne({email});
    }

    async findOne(id: string): Promise<User> {
        return this.userRepository.findOne(id);
    }

    async getUserList(): Promise<UserExitDto[]> {
        return this.userRepository.find();
    }

    async updateUser(email: string, user: User): Promise<UpdateResult> {
        return this.userRepository.update({email}, user);
    }

    async deleteUser(id: string): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }
}
