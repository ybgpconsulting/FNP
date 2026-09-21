import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;
const databaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || '(default)';

// Determine if valid Firebase credentials are provided
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    apiKey &&
    apiKey !== 'your-firebase-api-key' &&
    projectId &&
    !apiKey.includes('MY_')
  );
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    const firebaseConfig = {
      apiKey,
      authDomain,
      projectId,
      storageBucket,
      messagingSenderId,
      appId,
    };

    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app, databaseId);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('Firebase initialized successfully with project:', projectId);
  } catch (error) {
    console.warn('Firebase initialization skipped or encountered non-fatal error:', error);
  }
} else {
  console.info('Running in high-performance local demo mode. Configure VITE_FIREBASE_* in your environment to connect to live Firebase.');
}

export { app, auth, db, storage };
