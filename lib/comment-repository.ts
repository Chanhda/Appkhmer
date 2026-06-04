import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { Platform } from 'react-native';

import { getFirestoreDb, isDemoDataEnabled, isFirebaseConfigured } from '@/lib/firebase';

export type CommentDocument = {
  id: string;
  articleId: string;
  authorName: string;
  text: string;
  time: string;
  createdAt: string;
  userId?: string;
};

const storageKeyPrefix = 'khmerapp.comments.';

let AsyncStorage: any = null;
async function getAsyncStorage() {
  if (AsyncStorage === null && Platform.OS !== 'web') {
    try {
      const mod = await import('@react-native-async-storage/async-storage');
      AsyncStorage = mod.default;
    } catch (e) {
      console.warn('AsyncStorage not available');
    }
  }
  return AsyncStorage;
}

// Initial mock comments for default display so articles aren't empty
const defaultComments: Record<string, CommentDocument[]> = {
  'chua-doi': [
    { id: 'mock-1', articleId: 'chua-doi', authorName: 'Thạch Minh', text: 'Bài viết rất hay và ý nghĩa! Chùa Dơi thật sự là một kiệt tác kiến trúc của đồng bào Khmer.', time: '2 giờ trước', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'mock-2', articleId: 'chua-doi', authorName: 'Sơn Ha', text: 'Cảm ơn tác giả đã chia sẻ những tư liệu quý báu này cho thế hệ trẻ.', time: '1 ngày trước', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ],
};

export async function fetchCommentsForArticle(articleId: string): Promise<CommentDocument[]> {
  const localComments = await fetchLocalComments(articleId);

  // Default mock comments fallback if matching articleId
  const mocks = defaultComments[articleId] || [
    { id: 'mock-1', articleId, authorName: 'Thạch Minh', text: 'Bài viết rất hay và ý nghĩa! Cảm ơn tác giả đã chia sẻ.', time: '2 giờ trước', createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: 'mock-2', articleId, authorName: 'Sơn Ha', text: 'Cảm ơn tác giả đã chia sẻ những tư liệu quý báu này cho thế hệ trẻ.', time: '1 ngày trước', createdAt: new Date(Date.now() - 86400000).toISOString() },
  ];

  if (isDemoDataEnabled() || !isFirebaseConfigured()) {
    const all = [...mocks, ...localComments];
    all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return all;
  }

  try {
    const db = getFirestoreDb();
    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId)
    );
    const snapshot = await getDocs(q);
    const firestoreComments: CommentDocument[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        articleId: String(data.articleId ?? ''),
        authorName: String(data.authorName ?? 'Người dùng'),
        text: String(data.text ?? ''),
        time: String(data.time ?? 'Vừa xong'),
        createdAt: String(data.createdAt ?? new Date().toISOString()),
        userId: data.userId ? String(data.userId) : undefined,
      };
    });

    // Merge: mock first, then Firestore, then local comments
    const all = [...mocks, ...firestoreComments, ...localComments];
    // Filter duplicates based on ID
    const seen = new Set<string>();
    const unique = all.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    unique.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return unique;
  } catch (error) {
    console.error('Error fetching comments from firestore:', error);
    const all = [...mocks, ...localComments];
    all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return all;
  }
}

async function fetchLocalComments(articleId: string): Promise<CommentDocument[]> {
  try {
    const key = `${storageKeyPrefix}${articleId}`;
    let rawValue: string | null = null;
    
    if (Platform.OS === 'web') {
      rawValue = localStorage.getItem(key);
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        rawValue = await storage.getItem(key);
      }
    }

    if (!rawValue) return [];
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addCommentToArticle(
  articleId: string,
  text: string,
  authorName: string,
  userId?: string
): Promise<CommentDocument> {
  const newComment: CommentDocument = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    articleId,
    authorName,
    text,
    time: 'Vừa xong',
    createdAt: new Date().toISOString(),
    userId,
  };

  // If user is logged in and Firebase is running, save to Firestore
  if (userId && isFirebaseConfigured() && !isDemoDataEnabled()) {
    try {
      const db = getFirestoreDb();
      const docRef = await addDoc(collection(db, 'comments'), {
        articleId,
        authorName,
        text,
        createdAt: newComment.createdAt,
        userId,
      });
      newComment.id = docRef.id;
      return newComment;
    } catch (error) {
      console.error('Failed to save comment to Firestore, falling back to local storage:', error);
    }
  }

  // Fallback to local storage for guests or offline mode
  try {
    const key = `${storageKeyPrefix}${articleId}`;
    const current = await fetchLocalComments(articleId);
    const updated = [...current, newComment];

    if (Platform.OS === 'web') {
      localStorage.setItem(key, JSON.stringify(updated));
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        await storage.setItem(key, JSON.stringify(updated));
      }
    }
  } catch (error) {
    console.error('Error saving local comment:', error);
  }

  return newComment;
}

export async function countUserComments(userId?: string): Promise<number> {
  let localCommentsList: CommentDocument[] = [];
  try {
    if (Platform.OS === 'web') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(storageKeyPrefix)) {
          const raw = localStorage.getItem(key);
          try {
            const comments = raw ? JSON.parse(raw) : [];
            if (Array.isArray(comments)) {
              localCommentsList = [...localCommentsList, ...comments.filter((c: CommentDocument) => !userId || c.userId === userId)];
            }
          } catch {}
        }
      }
    } else {
      const storage = await getAsyncStorage();
      if (storage) {
        const allKeys: string[] = await storage.getAllKeys();
        const commentKeys = allKeys.filter((k: string) => k.startsWith(storageKeyPrefix));
        if (commentKeys.length > 0) {
          const pairs = await storage.multiGet(commentKeys);
          for (const [, rawValue] of pairs) {
            if (rawValue) {
              try {
                const comments = JSON.parse(rawValue);
                if (Array.isArray(comments)) {
                  localCommentsList = [...localCommentsList, ...comments.filter((c: CommentDocument) => !userId || c.userId === userId)];
                }
              } catch {}
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Error fetching local comments for counting:', err);
  }

  if (userId && isFirebaseConfigured() && !isDemoDataEnabled()) {
    try {
      const db = getFirestoreDb();
      const q = query(
        collection(db, 'comments'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const firestoreComments: CommentDocument[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          articleId: String(data.articleId ?? ''),
          authorName: String(data.authorName ?? 'Người dùng'),
          text: String(data.text ?? ''),
          time: String(data.time ?? 'Vừa xong'),
          createdAt: String(data.createdAt ?? new Date().toISOString()),
          userId: data.userId ? String(data.userId) : undefined,
        };
      });

      const all = [...firestoreComments, ...localCommentsList];
      const seen = new Set<string>();
      const unique = all.filter((c: CommentDocument) => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
      return unique.length;
    } catch (error) {
      console.error('Error querying Firestore user comments count:', error);
    }
  }

  // De-duplicate local comments list just in case
  const seen = new Set<string>();
  const uniqueLocal = localCommentsList.filter((c: CommentDocument) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
  return uniqueLocal.length;
}

