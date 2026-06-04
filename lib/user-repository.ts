import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';

import { firestoreSeed } from '@/data/firestore-seed';
import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type UserRole = 'user' | 'admin';

export type UserDocument = {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  favorites: string[];
  role: UserRole;
};

export type UserProfileInput = {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  favorites?: string[];
  role?: UserRole;
};

const collectionName = 'users';

function mapUserDoc(id: string, data: Record<string, unknown>): UserDocument {
  return {
    id,
    uid: String(data.uid ?? id),
    displayName: String(data.displayName ?? ''),
    email: String(data.email ?? ''),
    photoURL: String(data.photoURL ?? ''),
    favorites: Array.isArray(data.favorites) ? data.favorites.map((item) => String(item)) : [],
    role: data.role === 'admin' ? 'admin' : 'user',
  };
}

function normalizeProfile(input: UserProfileInput): UserDocument {
  return {
    id: input.id,
    uid: input.id,
    displayName: input.displayName,
    email: input.email,
    photoURL: input.photoURL ?? '',
    favorites: input.favorites ?? [],
    role: input.role ?? 'user',
  };
}

export async function getUserProfileById(id: string) {
  if (isDemoDataEnabled()) {
    return firestoreSeed.users.find((item) => item.id === id) ? mapUserDoc(id, firestoreSeed.users.find((item) => item.id === id) as Record<string, unknown>) : undefined;
  }

  if (!isFirebaseConfigured()) {
    return undefined;
  }

  try {
    const db = getFirestoreDb();
    const snapshot = await getDoc(doc(db, collectionName, id));

    if (!snapshot.exists()) {
      return undefined;
    }

    return mapUserDoc(snapshot.id, snapshot.data());
  } catch {
    return undefined;
  }
}

export async function ensureUserProfile(input: UserProfileInput): Promise<UserDocument> {
  const normalizedProfile = normalizeProfile(input);

  if (isDemoDataEnabled()) {
    const existing = firestoreSeed.users.find((item) => item.id === input.id);

    if (existing) {
      return mapUserDoc(input.id, existing as Record<string, unknown>);
    }

    return normalizedProfile;
  }

  if (!isFirebaseConfigured()) {
    return normalizedProfile;
  }

  const db = getFirestoreDb();
  const userRef = doc(db, collectionName, input.id);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    return mapUserDoc(snapshot.id, snapshot.data());
  }

  await setDoc(userRef, normalizedProfile);
  return normalizedProfile;
}

export async function fetchUsers(): Promise<UserDocument[]> {
  if (isDemoDataEnabled()) {
    return firestoreSeed.users.map((user) => mapUserDoc(user.id, user as Record<string, unknown>));
  }

  if (!isFirebaseConfigured()) {
    return [];
  }

  try {
    const db = getFirestoreDb();
    const usersQuery = query(collection(db, collectionName), orderBy('displayName', 'asc'), limit(20));
    const snapshot = await getDocs(usersQuery);

    return snapshot.docs.map((userDoc) => mapUserDoc(userDoc.id, userDoc.data()));
  } catch {
    return [];
  }
}

export async function updateUserRole(id: string, role: UserRole): Promise<boolean> {
  if (isDemoDataEnabled()) {
    const user = firestoreSeed.users.find((item) => item.id === id);
    if (user) {
      user.role = role;
      return true;
    }
    return false;
  }

  if (!isFirebaseConfigured()) {
    return false;
  }

  try {
    const db = getFirestoreDb();
    const userRef = doc(db, collectionName, id);
    await updateDoc(userRef, { role });
    return true;
  } catch (error) {
    console.error('Error updating user role:', error);
    return false;
  }
}