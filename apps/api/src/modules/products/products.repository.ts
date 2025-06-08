import { firebaseAdminDb } from '@/config/firebaseAdmin';
import { IProduct, ICreateProductDto, IUpdateProductDto } from '@zedobambu/shared-types';
import { Timestamp, DocumentData } from 'firebase-admin/firestore';

export class ProductRepository {
  private collection = firebaseAdminDb.collection('products');

  async create(productData: ICreateProductDto): Promise<IProduct> {
    const docRef = this.collection.doc();
    const newProduct: IProduct = {
      id: docRef.id,
      ...productData,
      availability: productData.availability ?? true,
      createdAt: Timestamp.now().toDate(),
      updatedAt: Timestamp.now().toDate(),
    };
    await docRef.set(newProduct);
    return newProduct;
  }

  async findAll(): Promise<IProduct[]> {
    const snapshot = await this.collection.orderBy('name').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc: DocumentData) => doc.data() as IProduct);
  }

  async findById(id: string): Promise<IProduct | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return doc.data() as IProduct;
  }

  async update(id: string, productData: IUpdateProductDto): Promise<IProduct | null> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return null;
    }
    const updatedData = {
      ...productData,
      updatedAt: Timestamp.now().toDate(),
    };
    await docRef.update(updatedData);
    const updatedDoc = await docRef.get();
    return updatedDoc.data() as IProduct;
  }

  async delete(id: string): Promise<boolean> {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return false;
    }
    await docRef.delete();
    return true;
  }
}