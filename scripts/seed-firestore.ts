import fs from 'node:fs';
import path from 'node:path';

import { applicationDefault, cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { firestoreSeed } from '../data/firestore-seed';

type SeedCollectionName = keyof typeof firestoreSeed;

type SeedDocument = {
  id: string;
  [key: string]: unknown;
};

function loadServiceAccount(): ServiceAccount | undefined {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath) {
    const resolvedPath = path.resolve(serviceAccountPath);
    return JSON.parse(fs.readFileSync(resolvedPath, 'utf8')) as ServiceAccount;
  }

  return undefined;
}

function sanitizeValue(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeValue(item))
      .filter((item) => item !== undefined);
  }

  if (typeof value === 'object') {
    const entryList = Object.entries(value as Record<string, unknown>);
    const normalizedEntries = entryList
      .map(([key, item]) => [key, sanitizeValue(item)] as const)
      .filter(([, item]) => item !== undefined);

    return Object.fromEntries(normalizedEntries);
  }

  return value;
}

function seedCollections() {
  return [
    ['categories', firestoreSeed.categories],
    ['articles', firestoreSeed.articles],
    ['heritages', firestoreSeed.heritages],
    ['media', firestoreSeed.media],
    ['users', firestoreSeed.users],
  ] as const;
}

async function writeCollection(collectionName: SeedCollectionName, documents: SeedDocument[]) {
  const db = getFirestore();
  const batchSize = 400;

  for (let index = 0; index < documents.length; index += batchSize) {
    const chunk = documents.slice(index, index + batchSize);
    const batch = db.batch();

    for (const document of chunk) {
      const { id, ...data } = document;
      const normalizedData = sanitizeValue(data) as Record<string, unknown>;
      const docRef = db.collection(collectionName).doc(id);
      batch.set(docRef, normalizedData);
    }

    await batch.commit();
    console.log(`Uploaded ${chunk.length} documents to ${collectionName}`);
  }
}

async function main() {
  const serviceAccount = loadServiceAccount();

  if (getApps().length === 0) {
    if (serviceAccount) {
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      initializeApp({ credential: applicationDefault() });
    }
  }

  for (const [collectionName, documents] of seedCollections()) {
    await writeCollection(collectionName, documents as SeedDocument[]);
  }

  console.log('Firestore seed upload completed.');
}

main().catch((error) => {
  console.error('Failed to seed Firestore.');
  console.error(error);
  process.exitCode = 1;
});