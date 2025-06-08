export interface IUserAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: IUserAddress;
  avatarUrl?: string;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastSignInTime?: string;
}

export type IUpdateUserProfileDto = Partial<Pick<IUser, 'name' | 'phone' | 'avatarUrl'> & { address: IUserAddress }>;
export type IAdminUpdateUserDto = Partial<Pick<IUser, 'name' | 'role' | 'disabled' | 'phone' | 'avatarUrl'> & { address: IUserAddress }>;
