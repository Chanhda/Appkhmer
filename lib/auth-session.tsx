import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useRouter } from 'expo-router';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';
import { ensureUserProfile, getUserProfileById, type UserDocument } from '@/lib/user-repository';

type AuthSessionValue = {
  firebaseUser: FirebaseUser | null;
  profile: UserDocument | null;
  loading: boolean;
  isAdmin: boolean;
};

const AuthSessionContext = createContext<AuthSessionValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setFirebaseUser(null);
      setProfile(null);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (nextUser) => {
      if (!nextUser) {
        setFirebaseUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setFirebaseUser(nextUser);
      setLoading(true);

      try {
        const nextProfile = await ensureUserProfile({
          id: nextUser.uid,
          email: nextUser.email ?? '',
          displayName: nextUser.displayName ?? nextUser.email?.split('@')[0] ?? 'Người dùng',
          photoURL: nextUser.photoURL ?? '',
          role: 'user',
        });

        setProfile(nextProfile);
      } catch {
        const existingProfile = await getUserProfileById(nextUser.uid);
        setProfile(existingProfile ?? null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthSessionValue>(() => ({
    firebaseUser,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
  }), [firebaseUser, profile, loading]);

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthSession must be used within AuthProvider');
  }

  return context;
}

export function useRequireAuth() {
  const router = useRouter();
  const session = useAuthSession();

  useEffect(() => {
    if (!session.loading && !session.firebaseUser) {
      router.replace('/auth');
    }
  }, [router, session.firebaseUser, session.loading]);

  return session;
}

export function useRequireAdmin() {
  const router = useRouter();
  const session = useAuthSession();

  useEffect(() => {
    if (!session.loading && (!session.firebaseUser || session.profile?.role !== 'admin')) {
      router.replace(session.firebaseUser ? '/' : '/auth');
    }
  }, [router, session.firebaseUser, session.loading, session.profile?.role]);

  return session;
}