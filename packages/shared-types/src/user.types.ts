export type IUserRole = 'customer' | 'admin';

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: IUserRole;
    createdAt: Date;
    updatedAt: Date;
}

export type ICreateUserDto = Pick<IUser, 'name' | 'email'> & { password?: string };
export type IUpdateUserDto = Partial<Omit<ICreateUserDto, 'password'>>;