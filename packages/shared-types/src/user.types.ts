export interface IUser {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export type ICreateUserDto = Pick<IUser, 'name' | 'email'> & { password?: string };
export type IUpdateUserDto = Partial<Omit<ICreateUserDto, 'password'>>;