import { IUpdateRestaurantDto, IRestaurantInfo } from '@zedobambu/shared-types';
import { RestaurantRepository } from './restaurant.repository';

export class RestaurantService {
  private repository: RestaurantRepository;

  constructor() {
    this.repository = new RestaurantRepository();
  }

  getRestaurantInfo(): Promise<IRestaurantInfo | null> {
    return this.repository.getInfo();
  }

  updateRestaurantInfo(data: IUpdateRestaurantDto): Promise<IRestaurantInfo | null> {
    return this.repository.updateInfo(data);
  }
}