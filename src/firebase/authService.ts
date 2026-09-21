import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { AdminUser } from '../types';
import { auth, db, isFirebaseConfigured } from './config';

const LOCAL_ADMIN_STORAGE_KEY = 'fnp_noida76_admin_user_v1';

// Pre-approved admin emails (configured via env or defaults)
const ADMIN_EMAILS = [
  'admin@fnpnoida76.com',
  'ybgp.consulting@gmail.com',
  import.meta.env.VITE_ADMIN_EMAIL,
].filter(Boolean).map((e) => e?.toLowerCase().trim());

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.email) return false;

  const normalizedEmail = user.email.toLowerCase().trim();
  if (ADMIN_EMAILS.includes(normalizedEmail)) {
    return true;
  }

  if (isFirebaseConfigured() && db) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        const data = adminDoc.data();
        return data?.role === 'admin' || data?.role === 'superadmin';
      }
    } catch (err) {
      console.warn('Error checking admin document in Firestore:', err);
    }
  }

  return false;
}

export async function loginAdminWithCredentials(email: string, pass: string): Promise<AdminUser> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !pass) {
    throw new Error('Please enter both your administrator email and password.');
  }

  // Enforce Firebase Authentication
  if (isFirebaseConfigured() && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      const isAdmin = await checkIsAdmin(cred.user);

      if (!isAdmin) {
        await signOut(auth);
        sessionStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
        throw new Error('Access denied. This account does not have administrator privileges in the store management registry.');
      }

      const adminUser: AdminUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'Store Admin',
        isAdmin: true,
      };
      sessionStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
      return adminUser;
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many unsuccessful login attempts. Please wait a moment or reset your password.');
      }
      throw err;
    }
  }

  throw new Error(
    'Firebase Authentication is not configured. Please configure your VITE_FIREBASE_* environment variables with your production Firebase project to sign in.'
  );
}

export async function logoutAdminUser(): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
  }
  sessionStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
}

export async function resetAdminPassword(email: string): Promise<void> {
  if (isFirebaseConfigured() && auth) {
    await sendPasswordResetEmail(auth, email);
    return;
  }
  // Simulated success message for demo/offline mode
  console.info('Password reset triggered for:', email);
}

export function getStoredAdminUser(): AdminUser | null {
  const raw = sessionStorage.getItem(LOCAL_ADMIN_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function subscribeToAuthChanges(callback: (user: AdminUser | null) => void): () => void {
  if (isFirebaseConfigured() && auth) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isAdmin = await checkIsAdmin(firebaseUser);
        if (isAdmin) {
          const adminUser: AdminUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || 'Store Admin',
            isAdmin: true,
          };
          sessionStorage.setItem(LOCAL_ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
          callback(adminUser);
          return;
        }
      }
      // Not logged in or not an authorized admin
      sessionStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
      callback(null);
    });
  }

  // Firebase not configured
  sessionStorage.removeItem(LOCAL_ADMIN_STORAGE_KEY);
  callback(null);
  return () => {};
}
