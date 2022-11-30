import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.enum";

@Entity('User')
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ default: null})
    name: string;

    @Column({ default: null})
    firstLastName: string;

    @Column({ default: null})
    secondLastName: string;

    @Column({ type: 'date', default: null})
    dateOfBirth: Date;

    @Column({ unique: true})
    email: string;

    @Column({ default: '1234abcd'})
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;
}