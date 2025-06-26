import { IUserAddress } from './user.types';

export interface IOpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface IRestaurantInfo {
  name: string;
  cnpj: string;
  phone: string;
  address: IUserAddress;
  openingHours: IOpeningHours;
}

export type IUpdateRestaurantDto = Partial<IRestaurantInfo>;