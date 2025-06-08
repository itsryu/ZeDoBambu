import { firebaseAdminAuth, firebaseAdminDb } from '@/config/firebaseAdmin';
import { IUser, IUpdateUserProfileDto, IAdminUpdateUserDto } from '@zedobambu/shared-types';
import { Timestamp } from 'firebase-admin/firestore';
import { UserRecord } from 'firebase-admin/auth';

export class UserRepository {
    private collection = firebaseAdminDb.collection('users');

    async findAll(searchTerm: string): Promise<IUser[]> {
        const listUsersResult = await firebaseAdminAuth.listUsers();

        let allUsers = listUsersResult.users;

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            allUsers = allUsers.filter(user =>
                user.displayName?.toLowerCase().includes(lowercasedTerm) ||
                user.email?.toLowerCase().includes(lowercasedTerm)
            );
        }

        const firestoreDocs = await this.collection.get();
        const firestoreData = new Map(firestoreDocs.docs.map(doc => [doc.id, doc.data() as IUser]));

        return allUsers.map((userRecord: UserRecord) => {
            const firestoreUser = firestoreData.get(userRecord.uid);
            return {
                id: userRecord.uid,
                email: userRecord.email || '',
                name: firestoreUser?.name || userRecord.displayName || 'Utilizador sem nome',
                role: firestoreUser?.role || (userRecord.customClaims?.role as 'admin' | 'customer') || 'customer',
                disabled: userRecord.disabled,
                avatarUrl: firestoreUser?.avatarUrl || userRecord.photoURL,
                createdAt: new Date(userRecord.metadata.creationTime),
                updatedAt: firestoreUser?.updatedAt || new Date(userRecord.metadata.lastRefreshTime!),
                lastSignInTime: userRecord.metadata.lastSignInTime,
                phone: firestoreUser?.phone || userRecord.phoneNumber,
                address: firestoreUser?.address,
            };
        });
    }

    async findById(uid: string): Promise<IUser | null> {
        const doc = await this.collection.doc(uid).get();
        return doc.exists ? (doc.data() as IUser) : null;
    }

    async update(uid: string, data: IUpdateUserProfileDto): Promise<IUser | null> {
        const docRef = this.collection.doc(uid);
        const doc = await docRef.get();
        if (!doc.exists) {
            return null;
        }
        const updatedData = { ...data, updatedAt: Timestamp.now().toDate() };
        await docRef.update(updatedData);
        const updatedDoc = await docRef.get();
        return updatedDoc.data() as IUser;
    }

    async adminUpdate(uid: string, data: IAdminUpdateUserDto): Promise<IUser | null> {
        const authUpdatePayload: { displayName?: string; disabled?: boolean; photoURL?: string; phoneNumber?: string } = {};
        if (data.name) authUpdatePayload.displayName = data.name;
        if (typeof data.disabled === 'boolean') authUpdatePayload.disabled = data.disabled;
        if (data.avatarUrl) authUpdatePayload.photoURL = data.avatarUrl;
        if (data.phone) authUpdatePayload.phoneNumber = data.phone;

        if (Object.keys(authUpdatePayload).length > 0) {
            await firebaseAdminAuth.updateUser(uid, authUpdatePayload);
        }

        if (data.role) {
            await firebaseAdminAuth.setCustomUserClaims(uid, { role: data.role });
        }

        const docRef = this.collection.doc(uid);
        const updateData: any = { ...data, updatedAt: Timestamp.now().toDate() };
        await docRef.set(updateData, { merge: true });

        return this.findById(uid);
    }

    async delete(uid: string): Promise<boolean> {
        await firebaseAdminAuth.deleteUser(uid);
        await this.collection.doc(uid).delete();
        return true;
    }
}