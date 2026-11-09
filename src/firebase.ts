import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDocFromCache, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

let app: any = null;
let db: any = null;
let auth: any = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase initialization skipped or failed, using local storage mode:", e);
}

export { db, auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged };
