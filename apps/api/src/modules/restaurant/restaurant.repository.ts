import { firebaseAdminDb } from '../../config/firebaseAdmin';
import { IRestaurantInfo, IUpdateRestaurantDto } from '@zedobambu/shared-types';
import { Timestamp } from 'firebase-admin/firestore';

const RESTAURANT_INFO_DOC_ID = 'main';

export class RestaurantRepository {
  private collection = firebaseAdminDb.collection('settings');
  private docRef = this.collection.doc(RESTAURANT_INFO_DOC_ID);

  async getInfo(): Promise<IRestaurantInfo | null> {
    const doc = await this.docRef.get();
    return doc.exists ? (doc.data() as IRestaurantInfo) : null;
  }

  async updateInfo(data: IUpdateRestaurantDto): Promise<IRestaurantInfo | null> {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now().toDate(),
    };
    await this.docRef.set(updateData, { merge: true });
    return this.getInfo();
  }
}