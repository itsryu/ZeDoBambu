import type { IUpdateUserProfileDto, IUser, IAdminUpdateUserDto } from '@zedobambu/shared-types';
import { UserRepository } from './user.repository';

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  getAllUsers(searchTerm: string): Promise<IUser[]> {
    return this.repository.findAll(searchTerm);
  }
  
  getProfile(uid: string): Promise<IUser | null> {
    return this.repository.findById(uid);
  }

  updateProfile(uid: string, data: IUpdateUserProfileDto): Promise<IUser | null> {
    return this.repository.update(uid, data);
  }

  adminUpdateUser(uid: string, data: IAdminUpdateUserDto): Promise<IUser | null> {
    return this.repository.adminUpdate(uid, data);
  }

  deleteUser(uid: string): Promise<boolean> {
    return this.repository.delete(uid);
  }
}