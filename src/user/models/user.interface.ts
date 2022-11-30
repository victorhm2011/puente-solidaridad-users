import { Role } from "./role.enum";

export interface User {
    id?: string;

    name?: string;

    firstLastName?: string;

    secondLastName?: string;

    dateOfBirth?: Date;

    email?: string;

    password?: string;

    role?: Role;
}